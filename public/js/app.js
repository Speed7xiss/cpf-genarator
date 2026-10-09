'use strict';

import { validateCPF, generateCPF } from './modules/api.js';

const input=document.querySelector('#cpf-input');
const count=document.querySelector('#digit-count');
const form=document.querySelector('#validate-form');
const result=document.querySelector('#validation-result');
const resultTools=document.querySelector('#result-tools');
const clearButton=document.querySelector('#clear-button');
const copyValidated=document.querySelector('#copy-validated');
const copyReport=document.querySelector('#copy-report');
const learnToggle=document.querySelector('#learn-toggle');
const learnPanel=document.querySelector('#learn-panel');
const generateButton=document.querySelector('#generate-button');
const regionSelect=document.querySelector('#region-select');
const generatedCPF=document.querySelector('#generated-cpf');
const originDigit=document.querySelector('#origin-digit');
const originName=document.querySelector('#origin-name');
const originStates=document.querySelector('#origin-states');
const copyButton=document.querySelector('#copy-button');
let currentGenerated='';
let lastValidated='';
let lastReport='';

function onlyDigits(value){return value.replace(/\D/g,'').slice(0,11)}
function formatInput(value){
 const digits=onlyDigits(value);
 if(digits.length<=3)return digits;
 if(digits.length<=6)return digits.replace(/^(\d{3})(\d+)$/,'$1.$2');
 if(digits.length<=9)return digits.replace(/^(\d{3})(\d{3})(\d+)$/,'$1.$2.$3');
 return digits.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2})$/,'$1.$2.$3-$4');
}
function announce(message,type=''){
 result.hidden=false;result.className='result'+(type?' '+type:'');
 result.textContent=message;result.classList.remove('result-enter');void result.offsetWidth;result.classList.add('result-enter');
}
async function copyText(text,button,success){
 if(!text)return;
 const old=button.textContent;
 try{
  await navigator.clipboard.writeText(text);
  button.textContent=success;button.classList.add('copied');
  window.setTimeout(()=>{button.textContent=old;button.classList.remove('copied')},1300);
 }catch{announce('Não foi possível copiar automaticamente. Selecione o texto e copie manualmente.','error')}
}
input.addEventListener('input',()=>{
 input.value=formatInput(input.value);count.textContent=onlyDigits(input.value).length+'/11';
 result.hidden=true;resultTools.hidden=true;
});
clearButton.addEventListener('click',()=>{
 input.value='';count.textContent='0/11';result.hidden=true;resultTools.hidden=true;input.focus();
});
form.addEventListener('submit',async event=>{
 event.preventDefault();const cpf=onlyDigits(input.value);
 if(!cpf){announce('Digite um CPF para começar.','error');resultTools.hidden=true;input.focus();return}
 const submit=form.querySelector('button[type="submit"]');
 submit.disabled=true;submit.classList.add('is-loading');submit.querySelector('span').textContent='Verificando…';
 announce('Conferindo os dígitos verificadores…');resultTools.hidden=true;
 try{
  const data=await validateCPF(cpf);
  let report=(data.valid?'Cálculo válido. ':'Cálculo inválido. ')+data.reason;
  if(data.region)report+=' Região indicada pelo nono dígito ('+data.region.digit+'): '+data.region.states.join(', ')+'. '+data.region.note;
  report+=' Não confirma emissão ou titularidade.';
  lastValidated=data.formatted||formatInput(cpf);lastReport=report;
  announce(report,data.valid?'success':'error');resultTools.hidden=false;
 }catch(error){announce(error.message||'Não foi possível conectar ao servidor.','error')}
 finally{submit.disabled=false;submit.classList.remove('is-loading');submit.querySelector('span').textContent='Validar CPF'}
});
copyValidated.addEventListener('click',()=>copyText(lastValidated,copyValidated,'CPF copiado ✓'));
copyReport.addEventListener('click',()=>copyText(lastReport,copyReport,'Resultado copiado ✓'));
learnToggle.addEventListener('click',()=>{
 const open=learnToggle.getAttribute('aria-expanded')==='true';
 learnToggle.setAttribute('aria-expanded',String(!open));learnPanel.hidden=open;
 learnToggle.querySelector('.disclosure-icon').textContent=open?'+':'−';
 if(!open){learnPanel.classList.remove('panel-enter');void learnPanel.offsetWidth;learnPanel.classList.add('panel-enter')}
});
function showRegion(region){
 originDigit.textContent=String(region.digit);originName.textContent=region.label;
 originStates.textContent=region.states.join(' · ')+(region.stateCount>1?' — grupo regional':' — estado');
}
generateButton.addEventListener('click',async()=>{
 generateButton.disabled=true;generateButton.classList.add('is-loading');generateButton.querySelector('span').textContent='Gerando…';
 try{
  const data=await generateCPF(regionSelect.value);currentGenerated=data.formatted;generatedCPF.textContent=currentGenerated;
  showRegion(data.region);copyButton.disabled=false;
  const card=document.querySelector('#sample-card');card.classList.remove('sample-pop');void card.offsetWidth;card.classList.add('sample-pop');
 }catch(error){originName.textContent='Não foi possível gerar';originStates.textContent=error.message||'Tente novamente.'}
 finally{generateButton.disabled=false;generateButton.classList.remove('is-loading');generateButton.querySelector('span').textContent='Gerar amostra'}
});
copyButton.addEventListener('click',()=>copyText(currentGenerated,copyButton,'✓ Copiado'));
