function main() {
    var kanvas = document.getElementById("kanvas");
    var gl = kanvas.getContext("webgl");

    var vertices = [
        0.5, 0.0, 0.0, 1.0, 1.0,   // A: kanan atas (CYAN)
        0.0, -0.5, 1.0, 0.0, 1.0,   // B: bawah tengah (MAGENTA)
        -0.5, 0.0, 1.0, 1.0, 0.0,  // C: kiri atas (KUNING)
        0.0, 0.5, 1.0, 1.0, 1.0  // D : Tengah atas (PUTIH)
    ];
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Vertex shader
    var vertexShaderCode =  `
    attribute vec2 aPosition;
    attribute vec3 aColor;
    uniform float uTheta;
    uniform float uUp;
    uniform float uDown;
    uniform float uRight;
    uniform float uLeft;
    varying vec3 vColor;
    void main() {
        float x = -sin(uTheta) * aPosition.x + cos(uTheta) * aPosition.y + uRight - uLeft;
        float y = cos(uTheta) * aPosition.x + sin(uTheta) * aPosition.y + uUp - uDown;
        gl_Position = vec4(x, y, 0.0, 1.0);
        vColor = aColor;
    }
    `;
    var vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShaderObject, vertexShaderCode);
    gl.compileShader(vertexShaderObject);   // sampai sini sudah jadi .o

    // Fragment shader
    var fragmentShaderCode = `
    precision mediump float;
    varying vec3 vColor;
    void main() {
        gl_FragColor = vec4(vColor, 1.0);
    }
    `;
    var fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShaderObject, fragmentShaderCode);
    gl.compileShader(fragmentShaderObject);   // sampai sini sudah jadi .o

    var shaderProgram = gl.createProgram(); // wadah dari executable (.exe)
    gl.attachShader(shaderProgram, vertexShaderObject);
    gl.attachShader(shaderProgram, fragmentShaderObject);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);


    // Variabel lokal
    var theta = 0.0;
    var freeze = false;
    var left = 0.0;
    var right = 0.0;
    var up = 0.0;
    var down = 0.0;
    // Variabel pointer ke GLSL
    var uTheta = gl.getUniformLocation(shaderProgram, "uTheta");
    var uUp = gl.getUniformLocation(shaderProgram, "uUp");
    var uLeft = gl.getUniformLocation(shaderProgram, "uLeft");
    var uRight = gl.getUniformLocation(shaderProgram, "uRight");
    var uDown = gl.getUniformLocation(shaderProgram, "uDown");

    //  Kita mengajari GPU bagaimana caranya mengoleksi
    //  nilai posisi dari ARRAY_BUFFER
    //  untuk setiap verteks yang sedang diproses
    var aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 
        5 * Float32Array.BYTES_PER_ELEMENT, 
        0 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(aPosition);
    var aColor = gl.getAttribLocation(shaderProgram, "aColor");
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 
        5 * Float32Array.BYTES_PER_ELEMENT, 
        2 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(aColor);

    // Grafika interaktif
    // Mouse
    function onMouseClick(event){
        freeze = !freeze;
    }
    document.addEventListener("click", onMouseClick, false);
    // papan ketuk/keyboard
    function onKeyDown(event){
        if(event.keyCode == 32) freeze = !freeze;
        if(event.keyCode == 87) FUp();
        if(event.keyCode == 83) FDown();
        if(event.keyCode == 68) FRight();
        if(event.keyCode == 65) FLeft();
    }
    function onKeyUp(event){
        if(event.keyCode == 32) freeze = !freeze;
    }
    document.addEventListener("keydown", onKeyDown, false);
    document.addEventListener("keyup", onKeyUp, false);

    function render(){
         gl.clearColor(1.0,      0.65,    0.0,    1.0);  // Oranye
         //            Merah     Hijau   Biru    Transparansi
        gl.clear(gl.COLOR_BUFFER_BIT);
        if(!freeze){
            theta += 0.01;
            gl.uniform1f(uTheta, theta);
        }
       // var vektor2D = [x, y];
       // gl.uniform2f(uTheta, vektor2D[0], vektor2D[1]);
       // gl.uniform2fv(uTheta, vektor2D);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
    function FUp(){
        gl.clearColor(1.0,      0.65,    0.0,    1.0);  // Oranye
         //            Merah     Hijau   Biru    Transparansi
        gl.clear(gl.COLOR_BUFFER_BIT);
        up += 0.1;
        gl.uniform1f(uUp, up);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }
    function FDown(){
        gl.clearColor(1.0,      0.65,    0.0,    1.0);  // Oranye
         //            Merah     Hijau   Biru    Transparansi
        gl.clear(gl.COLOR_BUFFER_BIT);
        down += 0.1;
        gl.uniform1f(uDown, down);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }
    function FLeft(){
        gl.clearColor(1.0,      0.65,    0.0,    1.0);  // Oranye
         //            Merah     Hijau   Biru    Transparansi
        gl.clear(gl.COLOR_BUFFER_BIT);
        left += 0.1;
        gl.uniform1f(uLeft, left);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }
    function FRight(){
        gl.clearColor(1.0,      0.65,    0.0,    1.0);  // Oranye
         //            Merah     Hijau   Biru    Transparansi
        gl.clear(gl.COLOR_BUFFER_BIT);
        right += 0.1;
        gl.uniform1f(uRight, right);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }
}