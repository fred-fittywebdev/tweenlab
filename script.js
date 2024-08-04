// Définition des chapitres
const chapitres = [
	{ numero: "01", titre: "Introduction" },
	{ numero: "02", titre: "Installation" },
	{ numero: "03a", titre: "Concepts fondamentaux - Tweens" },
	{ numero: "03b", titre: "Concepts fondamentaux - Timeline" },
	// Ajoutez d'autres chapitres ici
];

// Définition des chevaliers nécessaires pour chaque chapitre
const chevaliersNecessaires = {
	"01": ["knight-green"],
	"02": ["knight-blue"],
	"03a": ["knight-green", "knight-blue", "knight-red"],
	"03b": ["knight-green", "knight-blue", "knight-red"],
	default: ["knight-green"],
};

// Exemples de code pour chaque chapitre
const exemples = {
	"01": `// Animation simple pour le chevalier vert
gsap.to("#knight-green", {
    duration: 2,
    x: 100,
    y: 40,
    rotation: 360,
    scale: 1.5,
    ease: "power2.inOut"
});`,
	"02": `// Animation séquentielle pour le chevalier bleu
gsap.timeline()
    .from("#knight-blue", { duration: 1, y: -100, opacity: 0, ease: "bounce.out" })
    .to("#knight-blue", { duration: 1, x: 100, rotation: 360 });`,
	"03a": `// Démonstration de différents types de tweens
// To
gsap.to("#knight-green", { duration: 1, x: 100, rotation: 360 });

// From
gsap.from("#knight-blue", { duration: 1, y: -50, opacity: 0, delay: 1 });

// FromTo
gsap.fromTo("#knight-red", 
    { x: -100, opacity: 0 },
    { duration: 1, x: 0, opacity: 1, ease: "power2.inOut", delay: 2 }
);`,
	"03b": `// Timeline avec contrôle
const tl = gsap.timeline();
tl.to("#knight-green", { duration: 1, y: -50 })
  .to("#knight-blue", { duration: 1, rotation: 360 })
  .to("#knight-red", { duration: 1, scale: 1.5 });

// La timeline jouera automatiquement
// Vous pouvez utiliser tl.pause(), tl.resume(), tl.reverse(), etc. dans la console pour contrôler l'animation`,
	default: `// Écrivez votre code GSAP ici
gsap.to("#knight-green", {
    duration: 1,
    x: 50,
    y: 25,
    rotation: 180,
    scale: 1.2,
    ease: "power1.inOut"
});`,
};

// Quizzes pour chaque chapitre
const quizzes = {
	"01": {
		question:
			"Quelle méthode GSAP utilise-t-on pour animer vers des valeurs spécifiques ?",
		options: ["gsap.from()", "gsap.to()", "gsap.set()", "gsap.timeline()"],
		correctAnswer: 1,
	},
	"02": {
		question:
			"Quelle est la méthode recommandée pour installer GSAP dans un projet moderne ?",
		options: [
			"Télécharger et héberger les fichiers localement",
			"Utiliser un CDN",
			"Installer via npm",
			"Copier-coller le code source",
		],
		correctAnswer: 2,
	},
	"03a": {
		question: "Qu'est-ce qu'un 'tween' dans GSAP ?",
		options: [
			"Un type de timeline",
			"Une animation individuelle",
			"Un plugin GSAP",
			"Une fonction d'accélération",
		],
		correctAnswer: 1,
	},
	"03b": {
		question:
			"Quelle méthode est utilisée pour créer une timeline dans GSAP ?",
		options: [
			"gsap.createTimeline()",
			"gsap.timeline()",
			"new GSAP.Timeline()",
			"gsap.sequence()",
		],
		correctAnswer: 1,
	},
};

let chapitreActuel = "01";

function genererNavigation() {
	const nav = document.getElementById("chapitres");
	chapitres.forEach((chapitre) => {
		const lien = document.createElement("a");
		lien.href = `#chapitre-${chapitre.numero}`;
		lien.textContent = `${chapitre.numero}. ${chapitre.titre}`;
		lien.addEventListener("click", (e) => {
			e.preventDefault();
			afficherChapitre(chapitre.numero);
		});
		nav.appendChild(lien);
	});
}

function animerTransitionChapitre(callback) {
	const contenu = document.getElementById("contenu");

	gsap.to(contenu, {
		duration: 0.5,
		opacity: 0,
		y: -50,
		onComplete: () => {
			callback();
			gsap.to(contenu, {
				duration: 0.5,
				opacity: 1,
				y: 0,
			});
		},
	});
}

async function chargerContenuMarkdown(url) {
	try {
		const reponse = await fetch(url);
		if (!reponse.ok) {
			throw new Error(`HTTP error! status: ${reponse.status}`);
		}
		const texteMarkdown = await reponse.text();

		// Séparer le contenu principal et la section quiz
		const [contenuPrincipal, sectionQuiz] =
			texteMarkdown.split("## Section Quiz");

		// Traiter le contenu principal
		const contenuHTML = marked.parse(contenuPrincipal);

		// Traiter la section quiz si elle existe
		let quizHTML = "";
		if (sectionQuiz) {
			const quizContent = sectionQuiz.split("[QUIZ]")[0];
			quizHTML = `
                <div class="quiz-intro">
                    ${marked.parse(quizContent)}
                    <button id="ouvrir-quiz">Répondre au quiz</button>
                </div>
            `;
		}

		return { contenuHTML, quizHTML };
	} catch (erreur) {
		console.error("Erreur lors du chargement du contenu Markdown:", erreur);
		return {
			contenuHTML:
				"<p>Désolé, le contenu de ce chapitre n'a pas pu être chargé.</p>",
			quizHTML: "",
		};
	}
}

function afficherChevaliers(numeroChapitre) {
	const chevaliers = document.querySelectorAll("#animation-zone svg");
	chevaliers.forEach((chevalier) => chevalier.classList.remove("visible"));

	const aAfficher =
		chevaliersNecessaires[numeroChapitre] ||
		chevaliersNecessaires["default"];
	aAfficher.forEach((id) => {
		const chevalier = document.getElementById(id);
		if (chevalier) chevalier.classList.add("visible");
	});
}

function updateSyntaxHighlighting(element) {
	const code = element.textContent;
	element.innerHTML = Prism.highlight(
		code,
		Prism.languages.javascript,
		"javascript"
	);
}

function protectComments(element) {
	element.addEventListener("keydown", function (e) {
		const selection = window.getSelection();
		const range = selection.getRangeAt(0);
		const node = range.startContainer;

		if (
			node.parentNode.classList.contains("comment") ||
			(node.nodeType === Node.ELEMENT_NODE &&
				node.classList.contains("comment"))
		) {
			e.preventDefault();
		}
	});
}

function ouvrirModalQuiz() {
	const modal = document.getElementById("modal-quiz");
	modal.style.display = "block";
	creerQuiz(chapitreActuel);
}

async function afficherChapitre(numeroChapitre) {
	chapitreActuel = numeroChapitre;
	animerTransitionChapitre(async () => {
		const contenu = document.getElementById("contenu");
		const quizContainer = document.getElementById("quiz");
		const chapitrePrincipal = numeroChapitre.substring(0, 2);

		const { contenuHTML, quizHTML } = await chargerContenuMarkdown(
			`chapitres/${chapitrePrincipal}.md`
		);
		contenu.innerHTML = contenuHTML;
		quizContainer.innerHTML = quizHTML;

		Prism.highlightAllUnder(contenu);

		const exemple = exemples[numeroChapitre] || exemples["default"];
		const codeEditor = document.getElementById("code-editor");
		codeEditor.textContent = exemple;

		updateSyntaxHighlighting(codeEditor);

		afficherChevaliers(numeroChapitre);

		gsap.set("#knight-green, #knight-blue, #knight-red", {
			clearProps: "all",
		});

		// Ajouter l'écouteur d'événements pour le bouton du quiz
		const btnOuvrirQuiz = document.getElementById("ouvrir-quiz");
		if (btnOuvrirQuiz) {
			btnOuvrirQuiz.onclick = ouvrirModalQuiz;
		}
	});
}

function creerQuiz(numeroChapitre) {
	const quiz = quizzes[numeroChapitre];
	if (!quiz) return;

	const quizContent = document.getElementById("quiz-content");
	quizContent.innerHTML = `
        <h3>${quiz.question}</h3>
        ${quiz.options
			.map(
				(option, index) => `
            <button onclick="verifierReponse('${numeroChapitre}', ${index})">${option}</button>
        `
			)
			.join("")}
        <p id="resultatQuiz"></p>
    `;
}

function verifierReponse(numeroChapitre, index) {
	const quiz = quizzes[numeroChapitre];
	if (!quiz) return;

	const resultat = document.getElementById("resultatQuiz");
	if (index === quiz.correctAnswer) {
		resultat.textContent = "Correct !";
		resultat.style.color = "green";
	} else {
		resultat.textContent = "Incorrect. Essayez encore !";
		resultat.style.color = "red";
	}
}

function executerCode() {
	const codeEditor = document.getElementById("code-editor");
	const code = codeEditor.textContent;

	// Réinitialiser les positions des chevaliers
	gsap.set("#knight-green, #knight-blue, #knight-red", { clearProps: "all" });

	try {
		eval(code);

		// Attendre que l'animation soit terminée avant de nettoyer les styles
		setTimeout(() => {
			// Nettoyer les styles inline des boutons
			document.querySelectorAll("button").forEach((button) => {
				button.removeAttribute("style");
			});
		}, 3000); // Ajustez ce délai en fonction de la durée de vos animations
	} catch (error) {
		console.error("Erreur dans l'exécution du code :", error);
	}
}

function getCursorPosition(element) {
	const selection = window.getSelection();
	const range = selection.getRangeAt(0);
	const preCaretRange = range.cloneRange();
	preCaretRange.selectNodeContents(element);
	preCaretRange.setEnd(range.endContainer, range.endOffset);
	return preCaretRange.toString().length;
}

function setCursorPosition(element, position) {
	const range = document.createRange();
	const sel = window.getSelection();
	let currentLength = 0;
	let nodeStack = [element];
	let node;
	let foundStart = false;
	let stop = false;

	while (!stop && (node = nodeStack.pop())) {
		if (node.nodeType === 3) {
			const nextLength = currentLength + node.length;
			if (
				!foundStart &&
				position >= currentLength &&
				position <= nextLength
			) {
				range.setStart(node, position - currentLength);
				foundStart = true;
			}
			if (
				foundStart &&
				position >= currentLength &&
				position <= nextLength
			) {
				range.setEnd(node, position - currentLength);
				stop = true;
			}
			currentLength = nextLength;
		} else {
			let i = node.childNodes.length;
			while (i--) {
				nodeStack.push(node.childNodes[i]);
			}
		}
	}

	sel.removeAllRanges();
	sel.addRange(range);
}

function animateNeoBrutalism() {
	gsap.from("nav", {
		duration: 1,
		y: -50,
		opacity: 0,
		rotation: -5,
		ease: "bounce.out",
	});

	gsap.from("#animation-zone", {
		duration: 0.8,
		scale: 0.5,
		opacity: 0,
		delay: 0.5,
		ease: "back.out(1.7)",
	});

	gsap.from("button", {
		duration: 0.5,
		scale: 0,
		stagger: 0.1,
		ease: "elastic.out(1, 0.3)",
	});
}

// Gestion de la modale
const modal = document.getElementById("modal-quiz");
const btnOuvrirQuiz = document.getElementById("ouvrir-quiz");
const spanFermer = document.querySelector(".fermer-modal");

if (btnOuvrirQuiz) {
	btnOuvrirQuiz.onclick = function () {
		creerQuiz(chapitreActuel);
		modal.style.display = "block";
	};
}

if (spanFermer) {
	spanFermer.onclick = function () {
		modal.style.display = "none";
	};
}

window.onclick = function (event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
};

function creerBoutonExecuter() {
	const boutonExecuter = document.createElement("button");
	boutonExecuter.id = "btn-executer";
	boutonExecuter.textContent = "Exécuter";
	boutonExecuter.onclick = executerCode;

	const exemple = document.getElementById("exemple");
	exemple.appendChild(boutonExecuter);
}

window.onload = function () {
	genererNavigation();
	afficherChapitre("01");

	const codeEditor = document.getElementById("code-editor");
	if (codeEditor) {
		codeEditor.addEventListener("input", function () {
			const cursorPosition = getCursorPosition(this);
			updateSyntaxHighlighting(this);
			setCursorPosition(this, cursorPosition);
		});
		protectComments(codeEditor);
	}

	animateNeoBrutalism();

	// Créer le bouton Exécuter après les animations
	setTimeout(creerBoutonExecuter, 1000);

	const modal = document.getElementById("modal-quiz");
	const span = document.getElementsByClassName("fermer-modal")[0];

	span.onclick = function () {
		modal.style.display = "none";
	};

	window.onclick = function (event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	};
};
