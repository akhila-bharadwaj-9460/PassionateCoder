var result = document.getElementById('result');
var resultHistory = document.getElementById('result-history');
var buttons = document.querySelectorAll('button');
var backspace = document.querySelector('#backspace');
var icon = document.querySelector('#backspace i');
var output = ''
var flag = false;

function loadEvents(){
    buttons.forEach(btn=>{
        btn.addEventListener('click',(e)=>{
            btnTxt = e.target.innerText;

            if( btnTxt ==='x'){
                btnTxt='*';
                output+=btnTxt;
                result.value = output;
            }
            else if( btnTxt ==='÷'){
                btnTxt='/';
                output+=btnTxt;
                result.value = output;
            }
            else if(btnTxt==='C'){
                result.value = '';
                output = ''
            }
            else if(btnTxt==='AC'){
                result.value = '';
                resultHistory.textContent = '';
                output = '';
            }
            else if(btnTxt==='%'){
                output+=btnTxt;
                result.value = output;
                output = Number(output.slice(0,output.length-1))/100;
                result.value = output;
            }
            else if(btnTxt==='='){
                resultHistory.textContent = result.value;
                output = eval(output);
                result.value = output;
                
            }
            else if(e.target==icon){

                if(result.value!=''){
                    st = result.value;
                    result.value = st.slice(0,st.length-1);
                    output = result.value;
                }
            }
            else{
                output+=btnTxt
                result.value = output;
            }
        
        })
    })
    
}
loadEvents();

