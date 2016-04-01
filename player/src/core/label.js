import THREE from 'three';

export default class Label {
    
    // context.font="italic small-caps bold 12px arial";
    constructor(scene, text, x, y, z, font, color, backGroundColor, backgroundMargin) {
        
        if (!backgroundMargin)
            backgroundMargin = 8;
        
        var canvas = document.createElement("canvas");
        
        var context = canvas.getContext("2d");
        var fonts = font.split(' ');
        var size = parseInt(fonts[3].split('px')[0])
        var textAlign = 'left';
        
        // Autosize canvas
        context.font = fonts.join(' ');
        var textWidth = context.measureText(text).width;
        canvas.width = textWidth + backgroundMargin;
        canvas.height = size + backgroundMargin;
        
        // Autosize text
        context.font = fonts.join(' ');
        if (backGroundColor) {
            context.fillStyle = backGroundColor;
        }
        
        switch (textAlign) {
            case 'left':
                context.fillRect(0,
                canvas.height / 2 - size / 2 - backgroundMargin / 2,
                textWidth + backgroundMargin,
                size + backgroundMargin);
                break;            
            case 'center':
                context.fillRect(canvas.width / 2 - textWidth / 2 - backgroundMargin / 2,
                canvas.height / 2 - size / 2 - backgroundMargin / 2,
                textWidth + backgroundMargin,
                size + backgroundMargin);
                break;
        }
        
        context.textAlign = textAlign;
        context.textBaseline = "middle";
        context.fillStyle = color;
        
        switch (textAlign) {
            case 'left':
                context.fillText(text, backgroundMargin / 2, canvas.height / 2);
                break;            
            case 'center':
                context.fillText(text, canvas.width / 2, canvas.height / 2);
                break;
        }
        
        // context.strokeStyle = "black";
        // context.strokeRect(0, 0, canvas.width, canvas.height);     
        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        var material = new THREE.MeshBasicMaterial({
            map: texture
        });
        var mesh = new THREE.Mesh(new THREE.PlaneGeometry(canvas.width, canvas.height), material);
        // mesh.overdraw = true;
        //mesh.doubleSided = true;
        
        
        switch (textAlign) {
            case 'left':
                mesh.position.x = x + canvas.width/2;
                break;            
            case 'center':
                mesh.position.x = x;// - canvas.width;
                break;
        }
        
        
        mesh.position.y = y;// - canvas.height;
        mesh.position.z = z;
        mesh.rotation.x = -Math.PI / 2;

        scene.add(mesh);
        return mesh;
    }
}