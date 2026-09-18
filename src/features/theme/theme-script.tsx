/**
 * Aplica o tema salvo antes da primeira pintura, evitando o flash de troca.
 * O padrão é claro; o escuro só entra quando o usuário escolhe.
 */
const script = `(function(){try{var t=localStorage.getItem('falcao-theme');if(t==='dark'||t==='light'){document.documentElement.dataset.theme=t;}else{document.documentElement.dataset.theme='light';}}catch(e){document.documentElement.dataset.theme='light';}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
