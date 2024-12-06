#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>
#include <WebSocketsServer.h>
#include "time.h"
int pinRelay = 2;
const char* ssid = "DIGI_d82db0";
const char* password = "ddcc27d2";

const String PASSWORD="Ronald07";
const String TOKEN="xmgsAdcGr56SAd";
bool comand=false;


WebServer server(80);
WebSocketsServer webSocket = WebSocketsServer(81);

String postData;
unsigned long lastMillis = 0;
int timeInchidereAutomata=120;
const char* ntpServer = "pool.ntp.org";
const char* timezone = "EET-2EEST,M3.5.0/3,M10.5.0/4"; 
const int lenghtHistory = 10; 
String history[lenghtHistory];



void connectWifi(){
  WiFi.begin(ssid, password);
  Serial.print("Conectare la rețea Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Conectat!");


  Serial.print("Adresa IP: ");
  Serial.println(WiFi.localIP());
}
bool readStatus(){
  return comand;
}
void action(String name){
  String msg = "{\"status\": false}";
  comand=!comand;
  if(comand==true){
  msg = "{\"status\": true}";
  }
  shiftAndInsert(name+"^"+converAction(comand)+"^"+getFormattedTime());
  lastMillis=millis();
  broadcastMessage(msg);
  digitalWrite(pinRelay, comand);
}

String passToToken(String fullPass){
    String pass=separate(fullPass,'/',0);
    String name=separate(fullPass,'/',1);
    if(pass=="" || name==""){
      return "";
    }
    if(pass==PASSWORD){
      return TOKEN+"/"+name;
    }
     return "";
}

bool checkToken(String fullToken){
    String token=separate(fullToken,'/',0);
    String name=separate(fullToken,'/',1);
    if(token=="" || name==""){
      return false;
    }
    if(token==TOKEN){
      return true;
    }
     return false;
}








void setup() {

  Serial.begin(115200);
   pinMode(pinRelay, OUTPUT);
    digitalWrite(pinRelay, comand);

  connectWifi();
  routing();
  server.begin();
  Serial.println("Server pornit.");

  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
  configTzTime(timezone, ntpServer);
 
}

void loop() {
  webSocket.loop();
  server.handleClient();
  if(millis()-lastMillis > timeInchidereAutomata*1000 && comand==true){
    action("System");
  }

}

