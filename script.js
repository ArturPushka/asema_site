const button = document.getElementById("surpriseButton");
const startScreen = document.getElementById("startScreen");
const heartScreen = document.getElementById("heartScreen");
const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d");

let words = [];
let particles = [];

let animationStarted = false;
let animationStartTime = 0;
let heartFinishedTime = 0;


/* =====================================================
   CANVAS
===================================================== */

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);


/* =====================================================
   ФОРМА СЕРДЦА
===================================================== */

function heartFunction(t) {

    const x =
        16 * Math.pow(Math.sin(t), 3);

    const y =
        13 * Math.cos(t)
        - 5 * Math.cos(2 * t)
        - 2 * Math.cos(3 * t)
        - Math.cos(4 * t);

    return {
        x,
        y
    };
}


/* =====================================================
   СОЗДАЁМ I LOVE YOU
===================================================== */

function createWords() {

    words = [];

    const scale =
        Math.min(
            canvas.width,
            canvas.height
        ) / 34;

    /*
       Не слишком много надписей,
       чтобы всё работало плавно.
    */

    const amount = 48;


    for (let i = 0; i < amount; i++) {

        const t =
            (i / amount) *
            Math.PI *
            2;


        const heart =
            heartFunction(t);


        const targetX =
            canvas.width / 2 +
            heart.x * scale;


        const targetY =
            canvas.height / 2 -
            heart.y * scale;


        /*
           Стартовая точка.
        */

        const angle =
            Math.random() *
            Math.PI *
            2;


        const distance =
            180 +
            Math.random() * 350;


        const startX =
            canvas.width / 2 +
            Math.cos(angle) * distance;


        const startY =
            canvas.height / 2 +
            Math.sin(angle) * distance;


        words.push({

            startX,
            startY,

            targetX,
            targetY,

            progress: 0,

            rotation:
                (Math.random() - 0.5) * 0.18,

            size:
                14 + Math.random() * 3,

            delay:
                i * 35,

            text:
                "I LOVE YOU"
        });
    }
}


/* =====================================================
   ЧАСТИЦЫ
===================================================== */

function createParticles() {

    particles = [];

    const amount = 70;


    for (let i = 0; i < amount; i++) {

        const angle =
            Math.random() *
            Math.PI *
            2;


        const speed =
            1 +
            Math.random() * 3;


        particles.push({

            x:
                canvas.width / 2,

            y:
                canvas.height / 2,

            vx:
                Math.cos(angle) * speed,

            vy:
                Math.sin(angle) * speed,

            size:
                1 +
                Math.random() * 3,

            life:
                1,

            decay:
                0.006 +
                Math.random() * 0.012
        });
    }
}


/* =====================================================
   РИСУЕМ ЧАСТИЦЫ
===================================================== */

function drawParticles() {

    for (const particle of particles) {

        particle.x +=
            particle.vx;

        particle.y +=
            particle.vy;

        particle.vx *= 0.985;
        particle.vy *= 0.985;

        particle.life -=
            particle.decay;


        if (particle.life <= 0) {
            continue;
        }


        ctx.save();


        ctx.globalAlpha =
            particle.life;


        ctx.shadowBlur = 15;

        ctx.shadowColor =
            "#ff1744";


        ctx.fillStyle =
            "#ff718c";


        ctx.beginPath();

        ctx.arc(
            particle.x,
            particle.y,
            particle.size,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.restore();
    }
}


/* =====================================================
   СВЕТЯЩАЯСЯ ТОЧКА В ЦЕНТРЕ
===================================================== */

function drawCenterLight(time) {

    const elapsed =
        time -
        animationStartTime;


    /*
       Первые 1.5 секунды —
       появляется маленький свет.
    */

    const progress =
        Math.min(
            1,
            elapsed / 1500
        );


    const pulse =
        1 +
        Math.sin(
            time * 0.006
        ) * 0.15;


    const radius =
        (15 + progress * 25) *
        pulse;


    const gradient =
        ctx.createRadialGradient(

            canvas.width / 2,
            canvas.height / 2,
            0,

            canvas.width / 2,
            canvas.height / 2,
            radius * 4
        );


    gradient.addColorStop(
        0,
        "rgba(255,255,255,1)"
    );


    gradient.addColorStop(
        0.15,
        "rgba(255,80,110,0.9)"
    );


    gradient.addColorStop(
        0.45,
        "rgba(255,20,70,0.25)"
    );


    gradient.addColorStop(
        1,
        "rgba(255,0,50,0)"
    );


    ctx.fillStyle =
        gradient;


    ctx.beginPath();


    ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        radius * 4,
        0,
        Math.PI * 2
    );


    ctx.fill();
}


/* =====================================================
   СЕРДЦЕ ИЗ I LOVE YOU
===================================================== */

function drawWords(time) {

    const elapsed =
        time -
        animationStartTime;


    let allFinished = true;


    for (const word of words) {

        const localTime =
            elapsed -
            word.delay;


        if (localTime < 0) {

            allFinished = false;

            continue;
        }


        /*
           Анимация сбора сердца.
        */

        const duration = 2400;


        let progress =
            Math.min(
                1,
                localTime / duration
            );


        if (progress < 1) {
            allFinished = false;
        }


        /*
           Кубическая плавность.
        */

        const ease =
            1 -
            Math.pow(
                1 - progress,
                3
            );


        /*
           Во время полёта слова
           слегка закручиваются.
        */

        const swirl =
            (1 - ease) *
            Math.sin(
                progress * Math.PI * 3
            ) *
            35;


        const dx =
            word.targetX -
            word.startX;


        const dy =
            word.targetY -
            word.startY;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        const angle =
            Math.atan2(
                dy,
                dx
            );


        const x =
            word.startX +
            dx * ease +
            Math.cos(angle + Math.PI / 2)
            * swirl *
            Math.min(1, distance / 300);


        const y =
            word.startY +
            dy * ease +
            Math.sin(angle + Math.PI / 2)
            * swirl *
            Math.min(1, distance / 300);


        /*
           Появление слов.
        */

        const opacity =
            Math.min(
                1,
                progress * 2.5
            );


        ctx.save();


        ctx.translate(
            x,
            y
        );


        ctx.rotate(
            word.rotation *
            (1 - ease)
        );


        ctx.globalAlpha =
            opacity;


        /*
           Свечение.
        */

        ctx.shadowBlur = 16;

        ctx.shadowColor =
            "#ff1744";


        ctx.fillStyle =
            "#ff5475";


        ctx.font =
            `bold ${word.size}px Arial`;


        ctx.textAlign =
            "center";


        ctx.textBaseline =
            "middle";


        ctx.fillText(
            word.text,
            0,
            0
        );


        ctx.restore();
    }


    if (allFinished) {

        if (heartFinishedTime === 0) {

            heartFinishedTime =
                time;
        }

        return true;
    }


    return false;
}


/* =====================================================
   СВЕЧЕНИЕ ВНУТРИ СЕРДЦА
===================================================== */

function drawHeartGlow(time) {

    if (heartFinishedTime === 0) {
        return;
    }


    const elapsed =
        time -
        heartFinishedTime;


    const pulse =
        1 +
        Math.sin(
            elapsed * 0.004
        ) * 0.08;


    const radius =
        Math.min(
            canvas.width,
            canvas.height
        ) *
        0.28 *
        pulse;


    const gradient =
        ctx.createRadialGradient(

            canvas.width / 2,
            canvas.height / 2,

            0,

            canvas.width / 2,
            canvas.height / 2,

            radius
        );


    gradient.addColorStop(
        0,
        "rgba(255,40,80,0.18)"
    );


    gradient.addColorStop(
        0.4,
        "rgba(255,20,70,0.07)"
    );


    gradient.addColorStop(
        1,
        "rgba(255,0,50,0)"
    );


    ctx.fillStyle =
        gradient;


    ctx.beginPath();


    ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        radius,
        0,
        Math.PI * 2
    );


    ctx.fill();
}


/* =====================================================
   АСЕМА
===================================================== */

function drawAsema(time) {

    if (heartFinishedTime === 0) {
        return;
    }


    const elapsed =
        time -
        heartFinishedTime;


    /*
       Ждём немного после
       сборки сердца.
    */

    const appear =
        Math.min(
            1,
            Math.max(
                0,
                (elapsed - 900) / 1300
            )
        );


    if (appear <= 0) {
        return;
    }


    /*
       Небольшое увеличение
       при появлении.
    */

    const scale =
        0.75 +
        appear * 0.25;


    const pulse =
        1 +
        Math.sin(
            time * 0.003
        ) * 0.025;


    ctx.save();


    /*
       СТРОГО ЦЕНТР СЕРДЦА.
    */

    ctx.translate(
        canvas.width / 2,
        canvas.height / 2
    );


    ctx.scale(
        scale * pulse,
        scale * pulse
    );


    ctx.globalAlpha =
        appear;


    ctx.textAlign =
        "center";


    ctx.textBaseline =
        "middle";


    /*
       Элегантный читаемый шрифт.
    */

    ctx.font =
        'italic 66px Georgia, "Times New Roman", serif';


    /*
       Большое свечение.
    */

    ctx.shadowBlur = 40;

    ctx.shadowColor =
        "#ff1744";


    ctx.fillStyle =
        "#ffffff";


    ctx.fillText(
        "АСЕМА",
        0,
        0
    );


    /*
       Розовый второй слой.
    */

    ctx.shadowBlur = 12;

    ctx.shadowColor =
        "#ff6b81";


    ctx.fillStyle =
        "#ffd9df";


    ctx.fillText(
        "АСЕМА",
        0,
        0
    );


    ctx.restore();
}


/* =====================================================
   ФИНАЛЬНАЯ ВСПЫШКА
===================================================== */

function drawFinalFlash(time) {

    if (heartFinishedTime === 0) {
        return;
    }


    const elapsed =
        time -
        heartFinishedTime;


    /*
       Маленькая вспышка
       в момент завершения сердца.
    */

    if (
        elapsed > 100 &&
        elapsed < 700
    ) {

        const progress =
            (elapsed - 100) / 600;


        const alpha =
            0.12 *
            (1 - progress);


        const gradient =
            ctx.createRadialGradient(

                canvas.width / 2,
                canvas.height / 2,
                0,

                canvas.width / 2,
                canvas.height / 2,
                Math.min(
                    canvas.width,
                    canvas.height
                ) * 0.5
            );


        gradient.addColorStop(
            0,
            `rgba(
                255,
                255,
                255,
                ${alpha}
            )`
        );


        gradient.addColorStop(
            0.25,
            `rgba(
                255,
                60,
                100,
                ${alpha}
            )`
        );


        gradient.addColorStop(
            1,
            "rgba(255,0,0,0)"
        );


        ctx.fillStyle =
            gradient;


        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );
    }
}


/* =====================================================
   ОСНОВНОЙ ЦИКЛ
===================================================== */

function animate() {

    const time =
        Date.now();


    /*
       Полностью чёрный фон.
    */

    ctx.fillStyle =
        "#000000";


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /*
       Центральное свечение.
    */

    drawCenterLight(time);


    /*
       Частицы.
    */

    drawParticles();


    /*
       I LOVE YOU.
    */

    drawWords(time);


    /*
       Свечение сердца.
    */

    drawHeartGlow(time);


    /*
       Финальная вспышка.
    */

    drawFinalFlash(time);


    /*
       АСЕМА.
    */

    drawAsema(time);


    requestAnimationFrame(
        animate
    );
}


/* =====================================================
   КНОПКА
===================================================== */

button.addEventListener(
    "click",
    () => {

        /*
           Первый экран красиво
           увеличивается и исчезает.
        */

        startScreen.style.opacity =
            "0";


        startScreen.style.transform =
            "scale(1.08)";


        setTimeout(
            () => {

                startScreen.style.display =
                    "none";


                heartScreen.style.display =
                    "flex";


                /*
                   Подготовка.
                */

                createWords();

                createParticles();


                animationStartTime =
                    Date.now();


                heartFinishedTime =
                    0;


                if (!animationStarted) {

                    animationStarted =
                        true;

                    animate();
                }

            },
            1000
        );
    }
);
