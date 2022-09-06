"use strict"

window.onload = onWindowLoad();

let voices;
let selection = document.getElementById("select")

function onWindowLoad(){
    let timer = setInterval(function() {
        let voicesLoad = speechSynthesis.getVoices();
        console.log(voicesLoad);
        if (voicesLoad.length !== 0) {
            let newOption;

            for (const voice in voicesLoad){
                newOption = new Option(voicesLoad[voice].name, voice);
                selection.append(newOption);
                console.log(voicesLoad[voice].name)
            }

            voices = voicesLoad;
            clearInterval(timer);
        }
    }, 50);

    
}

function getVoice(select) {
    return voices[select.value];
}

function speak(text) {
    const message = new SpeechSynthesisUtterance();
    message.lang = "ru-RU";
    message.voice = getVoice(selection);
    message.text = text;
    message.pitch = document.getElementById("inputPitch").value;
    message.rate = document.getElementById("inputRate").value;
    window.speechSynthesis.speak(message);
}

function onclickSpeak(){
    const text = document.getElementById("speakingText").value;
    speak(text)
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition;

class Recognizer {
    constructor() {
        this.recognition = new SpeechRecognition();
        this.recognition.lang = "ru-RU";
        this.isRecognizing = false;
        this.transcript = "";
    }

    start(handler) {
        this.transcript = "";
        this.recognition.onresult = (event) => {
        this.onResult(event, handler);
        };
        this.recognition.start();
        this.isRecognizing = true;
        console.log("Started recognition");
    }

    stop() {
        this.recognition.abort();
        this.isRecognizing = false;
        console.log("Stopped recognition");
    }

    onResult(event, handler) {
        var interim_transcript = "";
        for (var i = event.resultIndex; i < event.results.length; ++i) {
        var result = event.results[i];
        if (result.isFinal) {
            this.transcript += result[0].transcript;
        } else {
            interim_transcript += result[0].transcript;
        }
        }
        console.log(interim_transcript);
        handler(interim_transcript);
    }
}

const txtOutput = document.getElementById("finalStr")
const recognizer = new Recognizer();

function showText(text) {
    txtOutput.value = text;
    txtOutput.value = recognizer.transcript;
}

function start() {
    txtOutput.value = "";
    txtOutput.value = "";
    recognizer.start(showText);
}

function stop() {
    recognizer.stop();
}