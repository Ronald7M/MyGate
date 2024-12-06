void routing() {
    // Rute
    server.on("/api", HTTP_GET, handleGet);
    server.on("/api", HTTP_POST, handlePost);
    server.on("/api/pass", HTTP_POST, handlePassPost);
    server.on("/api/history", HTTP_GET, handleGetHistory);

    // Preflight CORS pentru ruta /api și /api/pass
    server.on("/api", HTTP_OPTIONS, sendCrossOriginHeader);
    server.on("/api/pass", HTTP_OPTIONS, sendCrossOriginHeader);
    server.on("/api/history", HTTP_OPTIONS, sendCrossOriginHeader);
}



void handleGet() {
      setCrossOrigin();
  server.send(200, "text/plain", readStatus() ? "true" : "false");
}
void handleGetHistory() {
  setCrossOrigin();


  StaticJsonDocument<256> doc;  
  JsonArray jsonArray = doc.to<JsonArray>();


  for (int i = 0; i < lenghtHistory; i++) {
    JsonObject jsonObject = jsonArray.createNestedObject();  
    jsonObject["info"] = history[i];  
  }


  String response;
  serializeJson(doc, response);

  // Trimite răspunsul ca JSON
  server.send(200, "application/json", response);
}



void handlePost() {
      setCrossOrigin();
  if (server.hasArg("plain")) {

    String value=getValueFromJson(server.arg("plain"),"token");
    if(value==""){
          server.send(400, "text/plain","Incorect input" );
          return;
    }
    if(checkToken(value)){
          action(separate(value,'/',1));
          server.send(200, "text/plain","" );
    }
    server.send(400, "text/plain","Your token is incorrect" );
  } else {
    server.send(400, "text/plain","You dont have any input" );
  }
  
}
void handlePassPost() {
      setCrossOrigin();
  if (server.hasArg("plain")) {
    String fullPass=getValueFromJson(server.arg("plain"),"password");
    String token=passToToken(fullPass);
    if(token==""){
          server.send(400, "text/plain","Incorect pass" );
          return;
    }
  server.send(200, "application/json", "{\"auth\": \"" + token + "\"}");
  } else {
    server.send(400, "text/plain","You dont have any input" );
  }
}


void setCrossOrigin(){
    server.sendHeader(F("Access-Control-Allow-Origin"), F("*"));
    server.sendHeader(F("Access-Control-Max-Age"), F("600")); 
    server.sendHeader(F("Access-Control-Allow-Methods"), F("PUT,POST,GET,OPTIONS"));
    server.sendHeader(F("Access-Control-Allow-Headers"), F("*"));
};

void sendCrossOriginHeader(){
    Serial.println(F("sendCORSHeader"));
    setCrossOrigin();  
    server.send(204);  // 204 No Content răspuns pentru OPTIONS
}

void getSettings() {
    setCrossOrigin();  


    DynamicJsonDocument doc(512);
    doc["ip"] = WiFi.localIP().toString();
    doc["gw"] = WiFi.gatewayIP().toString();
    doc["nm"] = WiFi.subnetMask().toString();


    String buf;
    serializeJson(doc, buf);
    server.send(200, F("application/json"), buf);  
}

String converAction(bool comand){
  if(!comand){
    return "INCHIDERE";
  }else{
    return "DESCHIDERE";
  }
}

