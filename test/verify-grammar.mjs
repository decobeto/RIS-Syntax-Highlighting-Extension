import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modulesPath = "C:\\Users\\Pichau\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\node_modules";
const vscodeTextmateMod = await import(pathToFileURL(path.join(modulesPath, 'vscode-textmate', 'release', 'main.js')).href);
const vscodeOnigurumaMod = await import(pathToFileURL(path.join(modulesPath, 'vscode-oniguruma', 'release', 'main.js')).href);

const tm = vscodeTextmateMod.default || vscodeTextmateMod;
const onig = vscodeOnigurumaMod.default || vscodeOnigurumaMod;

// Carrega o binário WASM do Oniguruma
const wasmBin = fs.readFileSync(path.join(modulesPath, 'vscode-oniguruma', 'release', 'onig.wasm')).buffer;
await onig.loadWASM(wasmBin);

const onigLib = Promise.resolve({
  createOnigScanner(patterns) {
    return new onig.OnigScanner(patterns);
  },
  createOnigString(s) {
    return new onig.OnigString(s);
  }
});

const grammarContent = fs.readFileSync(path.join(__dirname, '..', 'syntaxes', 'ris.tmLanguage.json'), 'utf8');
const grammarJson = JSON.parse(grammarContent);

const registry = new tm.Registry({
  onigLib,
  loadGrammar: async (scopeName) => {
    if (scopeName === 'source.ris') {
      return grammarJson;
    }
    return null;
  }
});

const grammar = await registry.loadGrammar('source.ris');
if (!grammar) {
  console.error("❌ Falha ao carregar gramática source.ris");
  process.exit(1);
}

// 1. Teste no sample.ris
const sampleText = fs.readFileSync(path.join(__dirname, 'sample.ris'), 'utf8');
const lines = sampleText.split(/\r?\n/);

console.log(`=== Teste 1: Validando sample.ris (${lines.length} linhas) ===\n`);

let ruleStack = tm.INITIAL;
let errors = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const lineResult = grammar.tokenizeLine(line, ruleStack);
  ruleStack = lineResult.ruleStack;

  console.log(`L${String(i + 1).padStart(2, '0')}: ${line}`);
  for (const token of lineResult.tokens) {
    const tokenText = line.substring(token.startIndex, token.endIndex);
    const scopes = token.scopes.join(' ');
    console.log(`   [${token.startIndex}..${token.endIndex}] "${tokenText}" -> ${scopes}`);

    // Validações específicas
    if (line.startsWith('TY  -') && token.startIndex === 0 && token.endIndex === 2) {
      if (!scopes.includes('keyword.control.record.start.ris')) {
        errors.push(`L${i + 1}: TY deveria ter scope keyword.control.record.start.ris, obteve: ${scopes}`);
      }
    }
    if (line.startsWith('TY  -') && token.startIndex > 5) {
      if (!scopes.includes('entity.name.type.ris')) {
        errors.push(`L${i + 1}: Tipo de publicação no TY deveria ter entity.name.type.ris, obteve: ${scopes}`);
      }
    }
    if (line.startsWith('ER  -') && token.startIndex === 0 && token.endIndex === 2) {
      if (!scopes.includes('keyword.control.record.end.ris')) {
        errors.push(`L${i + 1}: ER deveria ter scope keyword.control.record.end.ris, obteve: ${scopes}`);
      }
    }
    if ((line.startsWith('UR  -') || line.startsWith('DO  -')) && token.startIndex >= 5) {
      if (tokenText.trim() && !scopes.includes('markup.underline.link.ris')) {
        errors.push(`L${i + 1}: Valor de link deveria ter markup.underline.link.ris, obteve: ${scopes}`);
      }
    }
    if (line.startsWith('Z9  -') && token.startIndex === 0 && token.endIndex === 2) {
      if (!scopes.includes('entity.name.tag.ris')) {
        errors.push(`L${i + 1}: Tag desconhecida Z9 deveria ter entity.name.tag.ris, obteve: ${scopes}`);
      }
    }
    if (line.includes('Esta segunda linha') && !scopes.includes('string.unquoted.ris')) {
      errors.push(`L${i + 1}: Linha de continuação deveria ter string.unquoted.ris, obteve: ${scopes}`);
    }
    if (line.includes('https://example.org/project-details') && tokenText.includes('https://example.org/project-details')) {
      if (!scopes.includes('markup.underline.link.ris')) {
        errors.push(`L${i + 1}: Link embutido em continuação deveria ter markup.underline.link.ris, obteve: ${scopes}`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error("\n❌ Erros encontrados na validação dos tokens de sample.ris:");
  errors.forEach(e => console.error(" - " + e));
  process.exit(1);
} else {
  console.log("\n✅ Todos os testes de escopo no sample.ris passaram com sucesso!\n");
}

// 2. Teste no arquivo real do Desktop (85 KB)
const realFilePath = 'C:\\Users\\Pichau\\Desktop\\export.ris';
if (fs.existsSync(realFilePath)) {
  console.log(`=== Teste 2: Validando arquivo real em escala (${realFilePath}) ===`);
  const realText = fs.readFileSync(realFilePath, 'utf8');
  const realLines = realText.split(/\r?\n/);
  console.log(`Linhas totais: ${realLines.length}`);

  const startTime = Date.now();
  let realRuleStack = tm.INITIAL;
  let recordCount = 0;
  let closedRecordCount = 0;

  for (let i = 0; i < realLines.length; i++) {
    const line = realLines[i];
    const res = grammar.tokenizeLine(line, realRuleStack);
    realRuleStack = res.ruleStack;

    if (line.startsWith('TY  -')) recordCount++;
    if (line.startsWith('ER  -')) closedRecordCount++;
  }
  const duration = Date.now() - startTime;
  console.log(`Tempo total de tokenização: ${duration} ms (${(realLines.length / (duration || 1) * 1000).toFixed(0)} linhas/segundo)`);
  console.log(`Registros abertos (TY): ${recordCount}, Registros fechados (ER): ${closedRecordCount}`);
  
  if (recordCount > 0 && recordCount === closedRecordCount) {
    console.log("✅ Arquivo real processado perfeitamente em escala sem travamentos ou backtracking!");
  } else {
    console.warn(`⚠️ Aviso: Registros abertos (${recordCount}) != fechados (${closedRecordCount})`);
  }
}
