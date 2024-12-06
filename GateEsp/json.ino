String Createjson(const String &input,String nameField) {
   
    StaticJsonDocument<200> doc;  

 
    doc[nameField] = input;


    String jsonString;
    serializeJson(doc, jsonString);
    
    return jsonString;
}


String getValueFromJson(const String &jsonString, const String &nameField) {

    StaticJsonDocument<200> doc; 

  
    DeserializationError error = deserializeJson(doc, jsonString);


    if (error) {
        Serial.print(F("Deserializare eșuată: "));
        Serial.println(error.f_str());
        return ""; 
    }

  
    if (doc.containsKey(nameField)) {
        return doc[nameField].as<String>();
    } else {
        return ""; 
    }
}

String separate(const String &input, char delimiter, int position) {
    int startIndex = 0;
    int endIndex = 0;
    int currentPosition = 0;

    while (endIndex != -1) {

        endIndex = input.indexOf(delimiter, startIndex);
        if (currentPosition == position) {
            return input.substring(startIndex, endIndex == -1 ? input.length() : endIndex);
        }

        startIndex = endIndex + 1;
        currentPosition++;
    }


    return "";
}

String getFormattedTime() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    return "Eșuat să obțină data/ora!";
  }


  char buffer[30];
  sprintf(buffer, "%04d/%02d/%02d^%02d/%02d/%02d", 
          timeinfo.tm_year + 1900,  // an
          timeinfo.tm_mon + 1,      // luna
          timeinfo.tm_mday,         // ziua
          timeinfo.tm_hour,         // ora
          timeinfo.tm_min,          // minut
          timeinfo.tm_sec);         // secundă
  
  return String(buffer);
}

void shiftAndInsert(String newValue) {

  for (int i = lenghtHistory - 1; i > 0; i--) {
    history[i] = history[i - 1];
  }

  history[0] = newValue;
}


