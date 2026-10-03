const button = document.getElementById("surpriseButton");
const startScreen = document.getElementById("startScreen");
const heartScreen = document.getElementById("heartScreen");
const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d");

let words = [];
let heartFinishedTime = 0;
let animationStarted = false;


/* =========================
   CANVAS
========================= */

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);


/* =========================
   ФОРМА СЕРДЦА
========================= */

function heartFunction(t) {

    const x =
        16 * Math.pow(Math.sin(t), 3);

    const y =
        13 * Math.cos(t)
        - 5 * Math.cos(2 * t)
        - 2 * Math.cos(3 * t)
        - Math.cos(4 * t);

    return {
        x: x,
        y: y
    };
}


/* =========================
   СОЗДАНИЕ СЕРДЦА
========================= */

function createWords() {

    words = [];
    heartFinishedTime = 0;

    const scale =
        Math.min(
            canvas.width,
            canvas.height
        ) / 34;

    /*
       48 надписей.
       Они располагаются именно
       по контуру сердца.
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
           Каждая надпись начинает
           движение со случайного места.
        */

        const startX =
            Math.random() * canvas.width;

        const startY =
            Math.random() * canvas.height;

        words.push({

            x: startX,
            y: startY,

            targetX: targetX,
            targetY: targetY,

            progress: 0,

            delay: i * 4,

            speed: 0.018,

            rotation:
                (Math.random() - 0.5) * 0.12,

            size: 16,

            opacity: 0,

            text: "I LOVE YOU"
        });
    }
}


/* =========================
   АНИМАЦИЯ
========================= */

function animate() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    let finished = true;


    for (const word of words) {

        if (word.delay > 0) {

            word.delay--;

            finished = false;

            continue;
        }


        word.progress +=
            word.speed;


        if (word.progress < 1) {
            finished = false;
        }


        if (word.progress > 1) {
            word.progress = 1;
        }


        /*
           Плавное замедление.
        */

        const ease =
            1 -
            Math.pow(
                1 - word.progress,
                3
            );


        const x =
            word.x +
            (
                word.targetX -
                word.x
            ) * ease;


        const y =
            word.y +
            (
                word.targetY -
                word.y
            ) * ease;


        word.opacity =
            Math.min(
                1,
                word.progress * 2
            );


        ctx.save();

        ctx.translate(x, y);

        ctx.rotate(word.rotation);


        /*
           Красивое свечение
           надписей.
        */

        ctx.shadowBlur = 14;

        ctx.shadowColor =
            "#ff1744";

        ctx.fillStyle =
            `rgba(
                255,
                55,
                85,
                ${word.opacity}
            )`;

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


    /*
       Сердце полностью собрано.
    */

    if (finished) {

        if (heartFinishedTime === 0) {

            heartFinishedTime =
                Date.now();
        }

        drawFinalEffect();
    }


    requestAnimationFrame(animate);
}


/* =========================
   ФИНАЛ
========================= */

function drawFinalEffect() {

    const time =
        Date.now();


    /*
       Мягкое свечение
       внутри сердца.
    */

    const pulse =
        0.08 +
        Math.sin(
            time * 0.003
        ) * 0.03;


    const gradient =
        ctx.createRadialGradient(

            canvas.width / 2,
            canvas.height / 2,

            20,

            canvas.width / 2,
            canvas.height / 2,

            Math.min(
                canvas.width,
                canvas.height
            ) * 0.4
        );


    gradient.addColorStop(
        0,
        `rgba(
            255,
            0,
            60,
            ${pulse}
        )`
    );

    gradient.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );


    ctx.fillStyle =
        gradient;


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* =========================
       АСЕМА В ЦЕНТРЕ СЕРДЦА
    ========================= */

    const elapsed =
        time -
        heartFinishedTime;


    /*
       Небольшая пауза после
       завершения сердца.
    */

    const appear =
        Math.min(
            1,
            Math.max(
                0,
                (elapsed - 700) / 1200
            )
        );


    if (appear <= 0) {
        return;
    }


    /*
       Лёгкое пульсирование.
    */

    const textPulse =
        1 +
        Math.sin(
            time * 0.003
        ) * 0.025;


    ctx.save();


    /*
       ВОТ ЗДЕСЬ НАДПИСЬ
       ПОПАДАЕТ РОВНО В ЦЕНТР
       СЕРДЦА.
    */

    ctx.translate(
        canvas.width / 2,
        canvas.height / 2
    );


    ctx.scale(
        textPulse,
        textPulse
    );


    ctx.globalAlpha =
        appear;


    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";


    /* =========================
       ШРИФТ АСЕМА
    ========================= */

    ctx.font =
        'italic 64px Georgia, "Times New Roman", serif';


    /*
       Большое мягкое свечение.
    */

    ctx.shadowBlur = 35;

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
       Второй слой делает
       буквы более красивыми
       и хорошо читаемыми.
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


/* =========================
   КНОПКА
========================= */

button.addEventListener(
    "click",
    () => {

        /*
           Первый экран исчезает.
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
                   Создаём сердце.
                */

                createWords();


                /*
                   Запускаем анимацию.
                */

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
