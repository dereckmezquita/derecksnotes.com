interface Number {
    leadingZero(): string;
}

Number.prototype.leadingZero = function(): string {
    return ((this < 10) ? ('0' + this.toString()) : (this.toString()));
}

function formattedLocalTime(): string {
    const currentTime: Date = new Date();

    const currentMonth: string = currentTime.toLocaleString("en-us", { month: "short" });
    const currentDay: number = currentTime.getDate();
    const currentHour: number = currentTime.getHours();
    const currentMinute: number = currentTime.getMinutes();
    const currentSecond: number = currentTime.getSeconds();

    const now: string = `${currentDay.leadingZero()} ${currentMonth} ${currentHour.leadingZero()}:${currentMinute.leadingZero()}:${currentSecond.leadingZero()}`;

    return now;
}

const clock: Element = document.querySelector(".clock");

clock.innerHTML = formattedLocalTime();

setInterval(() => {
    const now: string = formattedLocalTime();
    clock.innerHTML = now;

    let sideClock: Element | boolean = false;

    sideClock = document.querySelector(".side-clock");
    if (sideClock) {
        sideClock.innerHTML = now;
    }
}, 1000);