document.addEventListener("DOMContentLoaded", function () {
	// Initialiser CodeMirror pour HTML
	const htmlEditor = CodeMirror.fromTextArea(
		document.getElementById("html-editor"),
		{
			mode: "xml",
			htmlMode: true,
			theme: "monokai",
			lineNumbers: true,
		}
	);

	// Initialiser CodeMirror pour CSS
	const cssEditor = CodeMirror.fromTextArea(
		document.getElementById("css-editor"),
		{
			mode: "css",
			theme: "monokai",
			lineNumbers: true,
		}
	);

	// Initialiser CodeMirror pour JavaScript
	const jsEditor = CodeMirror.fromTextArea(
		document.getElementById("js-editor"),
		{
			mode: "javascript",
			theme: "monokai",
			lineNumbers: true,
		}
	);

	// Code par défaut
	htmlEditor.setValue(`<div id="box"></div>`);
	cssEditor.setValue(`#box {
    width: 100px;
    height: 100px;
    background-color: #3498db;
}`);
	jsEditor.setValue(`gsap.to("#box", {
    duration: 2,
    x: 200,
    y: 50,
    rotation: 360,
    backgroundColor: "#e74c3c",
    ease: "power2.inOut",
    repeat: -1,
    yoyo: true
});`);

	// Fonction pour exécuter le code
	function runCode() {
		const html = htmlEditor.getValue();
		const css = cssEditor.getValue();
		const js = jsEditor.getValue();

		const iframe = document.getElementById("preview-frame");
		const iframeDoc =
			iframe.contentDocument || iframe.contentWindow.document;

		iframeDoc.open();
		iframeDoc.write(`
            <html>
                <head>
                    <style>${css}</style>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js"><\/script>
                </head>
                <body>
                    ${html}
                    <script>${js}<\/script>
                </body>
            </html>
        `);
		iframeDoc.close();
	}

	// Ajouter l'événement au bouton
	document.getElementById("run-code").addEventListener("click", runCode);

	// Exécuter le code par défaut
	runCode();
});
