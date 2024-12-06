void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
    switch(type) {
        case WStype_DISCONNECTED: 
            handleDisconnect(num);
            break;
        case WStype_CONNECTED: { 
            handleConnect(num);
            break;
        }
        case WStype_TEXT: 
            handleMessage(num, payload);
            break;
    }
}


void handleConnect(uint8_t num) {
    IPAddress ip = webSocket.remoteIP(num);
    Serial.printf("Client %u conectat de la %s\n", num, ip.toString().c_str());
}

void handleDisconnect(uint8_t num) {
    Serial.printf("Client %u deconectat\n", num);
}


void handleMessage(uint8_t num, uint8_t * payload) {
    Serial.printf("Mesaj primit de la client %u: %s\n", num, payload);

    sendMessage(num, "Mesaj primit!");
}


void sendMessage(uint8_t num, const char* message) {
    webSocket.sendTXT(num, message);
}

void broadcastMessage(String message) {

    for (uint8_t i = 0; i < webSocket.connectedClients(); i++) {

        webSocket.sendTXT(i, message.c_str());
    }
}
    