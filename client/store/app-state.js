import {
    observable,
    computed,
    autorun,
    action,
} from 'mobx';

export class Appstate {
    @observable count = 10;
    @observable name = 'Jack';
    @computed get msg() {
        return `${this.name} say 倒计时还剩 ${this.count} 秒`;
    }
    @action add() {
        if (this.count > 0) {
            this.count -= 1;
        }
    }
    @action changeName(name) {
        this.name = name;
    }
}

const appState = new Appstate();

setInterval(() => {
    appState.add();
}, 1000);

autorun(() => {
    console.log(appState.msg);
});

export default appState;
