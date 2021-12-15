"use strict";

import {LotoGrid} from "./loto_grid.js";



export class Loto{

    constructor() {
        this.random = new LotoGrid();
        this.user = new LotoGrid();
        this.hmlElements = {
            inputs50 : Array.from(document.getElementsByClassName("nombres")),
            input10: document.getElementById("complementaire"),
            choix: document.getElementById("choix"),
            submitBtn: document.getElementById('submitBtn'),
            resultGenerate: document.getElementsByClassName("generate")[0],
            resultSaisi: document.getElementsByClassName("saisi")[0],
            resultH3: document.querySelector("h3"),
            result: document.getElementById("result"),
            reset : document.getElementById("reset"),
            nbRound : document.getElementById("nbRound"),
        };

        this.matchReward = {
            2:1000,
            3:5000,
            4:10000,
            5:100000,
        };
        this.numberSuppReward = 2000;

        this.hmlElements.submitBtn.addEventListener("click", ()=>this.play());
        this.hmlElements.reset.addEventListener("click", ()=>this.resetHtml());
    }


    play() {
        // wrong input value
        if (!this.getInputsValue()){
            alert("?");
            this.resetHtml();
            return ;
        }
        //good inputs value size
        if (this.user.numberSet.size === 5){
            let nbRound = parseInt(this.hmlElements.nbRound.value)
            // wrong nbRound Value
            if (! this.isValidNumber(nbRound))
            {
                alert("?");
                this.resetHtml();
                return ;
            }
            this.playNRound(nbRound);

        }
        else{
            console.log("error");
        }
    }
    resetHtml() {
        this.hmlElements.resultSaisi.innerHTML = "";
        this.hmlElements.resultGenerate.innerHTML = "";
        this.hmlElements.resultH3.innerHTML = "";
        this.hmlElements.result.classList.add("hide");
        this.hmlElements.choix.classList.remove("hide");
        this.hmlElements.input10.style.setProperty("opacity", "1");
        this.hmlElements.inputs50.forEach(input => {
            input.style.setProperty("opacity", "1");
        })
    }



    regenerateRandom(){

        this.random.regenerateSet();
        while(this.random.numberSet.size < 5){
            let r = this.getRandomInt(50);
            while (this.random.numberSet.has(r)){
                r = this.getRandomInt(50);
            }
            this.random.numberSet.add(r);
        }
        this.random.otherNumber = this.getRandomInt(10);
    }


    isValidNumber(nb) {
        return !isNaN(nb) && nb !== undefined && nb > 0;
    }

    getInputsValue(){
        this.user.regenerateSet();
        for (const input of this.hmlElements.inputs50){
            let val = parseInt(input.value);
            if (! this.isValidNumber(val)){
                return false;
            }
            if (this.user.numberSet.has(val)){
                input.classList.add("warning");
            }
            else{
                if (input.classList.contains("warning"))
                    input.classList.remove("warning");
                input.style.setProperty("opacity", "0.5");
                this.user.numberSet.add(val);
            }
        }
        this.user.otherNumber = parseInt(this.hmlElements.input10.value);
        this.hmlElements.input10.style.setProperty("opacity", "0.5");
        return true;
    }


    calculateReward() {
        // python style
        let nbMatch = Array.from(this.user.numberSet).filter(x => this.random.numberSet.has(x)).length;
        return  (this.matchReward.hasOwnProperty(nbMatch) ? this.matchReward[nbMatch] : 0) + (this.random.otherNumber === this.user.otherNumber ? this.numberSuppReward : 0);
    }

    showTirage() {

        let resGenerate = "<div class='tirage'>";
        for (let elem of this.random.numberSet){
            resGenerate += `
                 <input type="number" value="${elem}" disabled class="resultNumber circle ${this.user.numberSet.has(elem) ? 'win':''}">
            `;
        }
        resGenerate += `<input type="number" value="${this.random.otherNumber}" disabled class="resultNumber circle ${this.user.otherNumber === this.random.otherNumber ? 'win':''}"></div>`;
        this.hmlElements.resultGenerate.innerHTML += resGenerate;

    }

    showResult(reward) {
        this.hmlElements.resultH3.innerHTML += reward ? `Vous avez donc gagné <span>${reward.toLocaleString()}</span>€` : "Vous n'avez rien gagné , mais vous pouvez retenter votre chance !";


        this.hmlElements.resultSaisi.innerHTML += `
            Pour Rappel, Voici votre grille:${Array.from(this.user.numberSet).join(", ")}
            et le numero complementaire <span style="font-weight: bold">${this.user.otherNumber}</span>
        `;
        this.hmlElements.result.classList.remove("hide");
        this.hmlElements.choix.classList.add("hide");
    }

    playNRound(n) {
        let reward = 0;
        for (let i=0; i<n; i++){
            this.regenerateRandom();
            reward += this.calculateReward();
            this.showTirage();
        }
        this.showResult(reward);

    }

    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }



}



