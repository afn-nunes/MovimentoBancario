import React, {useState, useEffect, useCallback} from 'react';
import api from '../../services/api';
import axios from 'axios';
import {useDropzone} from 'react-dropzone'
import Dropzone from 'react-dropzone'
import './style.css';
export default function Extrato(){  
  const tblMovimentos = document.querySelector('#tbl-movimentos tbody'); 
  const moment = require('moment-timezone');
  const ofx = require('@wademason/ofx')
  const [extratoConta, setExtratoConta] = useState([]);
  const [movimentos, setMovimentos] = useState([]);  
  const [banco, setBanco] = useState('');
  const [agencia, setAgencia] = useState('');
  const [conta, setConta] = useState(''); ;
  const [Dollar, setDollar] = useState([]) ;
  const [Euro, setEuro] = useState([]) ;
  const [BitCoin, setBitCoin] = useState([]);
  const [saldo, setSaldo] = useState(0);  
  const [arquivo, setArquivo] = useState({});
  async function CarregarSaldoConta(){
    const response = await api.get('extrato');
    setMovimentos(response.data);
    setSaldo(response.headers['x-total-value']);  
  }; 
   
  async function ImportarExtrato(){    
    try{
      console.log(arquivo);      
      const obj = ofx.parse(arquivo)
      const dadosBancarios = obj.body["OFX"]["BANKMSGSRSV1"]["STMTTRNRS"]["STMTRS"];      
             
      setBanco(dadosBancarios.BANKACCTFROM.BANKID._text)       
      setAgencia(dadosBancarios.BANKACCTFROM.ACCTID._text)        
      setConta(dadosBancarios.BANKACCTFROM.ACCTID._text)        
      popularTabela(dadosBancarios.BANKTRANLIST.STMTTRN, tblMovimentos)
      setExtratoConta(dadosBancarios.BANKTRANLIST.STMTTRN);  
      setArquivo('');                      
    } catch(err){
      alert('Extrato não encontrado');
    }    
  };

  async function AtualizarCotacao(){    
    try{    
      axios.get('http://economia.awesomeapi.com.br/json/all').then(function(response){
        setDollar(response.data.USD);
        setEuro(response.data.EUR);
        setBitCoin(response.data.BTC);
        getDate();        
       });                    
    } catch(err){
      alert('Falha na comunicação com a API');
    }    
  };

  function popularTabela(colecao, tabela){
    var linha;
    var coluna;       
    for (let i = 0; i < colecao.length; i++) {
      linha = document.createElement('tr');           
      const registro = colecao[i]; 
      
      coluna = document.createElement('td');
      coluna.textContent = convertDate(moment.tz(registro.DTPOSTED._text, "YYYY MM DD", "America/Sao_Paulo").utc().format()); 
      coluna.className = 'data';      
      linha.appendChild(coluna);

      coluna = document.createElement('td');            
      coluna.textContent = registro.FITID._text.slice(registro.FITID._text.indexOf(": ") + 2, registro.FITID._text.length);
      coluna.className = 'descricao';
      linha.appendChild(coluna);

      coluna = document.createElement('td');            
      coluna.textContent = registro.TRNAMT._text;
      coluna.className = 'valor';
      linha.appendChild(coluna);

      coluna = document.createElement('td');            
      coluna.textContent = registro.TRNTYPE._text;
      coluna.className = 'tpMovimento';       
      linha.appendChild(coluna);

      tabela.appendChild(linha);                  
    }
  }

  async function gravarExtrato(){ 
    var data = '';
    var descricao = '';  
    var idDadosBancarios = 1; 
    var tpMovimento = '';    
    var valor = 0;     

    var dados = {};
  
    for (let i = 0; i < extratoConta.length; i++) {                  
      const registro = extratoConta[i]; 
            
      data = convertDate(moment.tz(registro.DTPOSTED._text, "YYYY MM DD", "America/Sao_Paulo").utc().format());      
      descricao = registro.FITID._text.slice(registro.FITID._text.indexOf(": ") + 2, registro.FITID._text.length);         
      valor = registro.TRNAMT._text;         
      tpMovimento = registro.TRNTYPE._text; 

      dados = {
        data,
        descricao,
        idDadosBancarios,
        valor,
        tpMovimento        
      };

      try{
        await api.post('extrato', dados);        
      } catch(err){
        alert('Erro no cadastro, tente novamente')
      }                
    }
    CarregarSaldoConta();
  }

  function convertDate(date){    
    var dateFromAPI = new Date(date); 
   
    return(dateFromAPI.toLocaleDateString());
  }

  function getSaldo(){
    if (isNaN(saldo)){
      return 0
      }
    else{
      return saldo
    };
  }

  function getDate(){
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return convertDate(moment().tz(timezone).format());
  }

  useEffect(() =>{
    CarregarSaldoConta() 
    AtualizarCotacao();  
  },[]);

  return(
    <div className= "container">
      <div className= "col-sm-12" id="div-header">              
        <table id = "tbl-dados-conta">
          <thead className="thead-dark">
            <tr className="col-sm-12"><th>Dados bancários:</th></tr>
            <tr className="col-sm-4"><th>Banco: </th><td>{banco}</td></tr>
            <tr className="col-sm-4"><th>Agência: </th><td>{agencia.slice(0, agencia.indexOf("/"))}</td></tr>
            <tr className="col-sm-4"><th>Conta: </th><td>{conta.slice(conta.indexOf("/") + 1, conta.length)}</td></tr>              
          </thead>
        </table>
        <div className= "col-sm-6" id = "div-button-gravar">
          <button className = "btn-primary" onClick = {gravarExtrato}>Gravar Extrato</button> 
        </div>
      </div> 

      <div className= "col-sm-12" id="div-tabelas">
        <section className="">
          <div className= "container" id="div-tbl-movimentos">              
            <table id="tbl-movimentos" className="table table-dark">
              <thead className="thead-dark">
              <tr className="header">
                  <th><div id="data">Data:</div></th>
                  <th><div id="descricao">Descrição:</div></th>
                  <th><div id="valor">Valor:</div></th>
                  <th><div id="tpMovimento">Tipo de Movimento:</div></th>
                </tr>
              </thead>
              <tbody>
                {movimentos.map(movimento =>(
                  <tr key={movimento.id}>                        
                    <td>{convertDate(movimento.data)}</td>                          
                    <td className = "col-sm-7" >{movimento.descricao}</td>
                    <td>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(movimento.valor)}</td>
                    <td>{movimento.tpMovimento}</td>                                     
                  </tr>
                ))} 
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <div className= "col-sm-12" id="div-importar-extrato">
        <div className= "col-sm-4" id="div-dropzone">
          <Dropzone onDrop={useCallback((acceptedFiles) => {
                                acceptedFiles.forEach((file) => {
                                  const reader = new FileReader()
                                  reader.onload = () => {
                                    const binaryStr = reader.result
                                    setArquivo(binaryStr);                                    
                                  }
                                  reader.readAsText(file);                                  
                                })                              
                              }, [])}>
              {({getRootProps, getInputProps}) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>Clique aqui para selecionar um arquivo</p>
                  </div>
                </section>
              )}
          </Dropzone>
        </div>
        <div className= "col-sm-4" id="div-button-importar">            
          <button className = "btn-primary" onClick = {ImportarExtrato}>Importar Extrato OFX</button>           
        </div>
        <div className= "col-sm-4" id = "div-title-importar">          
          <h1>Saldo: {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(getSaldo())}</h1>
        </div>
      </div>
      <div className= "col-sm-12" id="div-cotacao-moeda">
        <div className= "col-sm-12" id="div-dt-cotacao">
          <h1>Cotações do dia: {getDate()}</h1>            
          <button className = "btn-primary" id="btn-atualizar" onClick = {AtualizarCotacao}>Atualizar cotações</button>             
        </div>

        <div className= "col-sm-12" id="div-dados-cotacao">
          <div className= "col-sm-3" id="div-cotacao-dollar">
            <table  className="table-condensed">
              <tbody>
              <tr ><th colSpan="2" style={{textAlign: "center"}}>Dollar:</th></tr>          
              <tr>
                <th>Venda:</th>
                <td>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(Dollar.bid)}</td>
              </tr>          
              <tr>
                <th>Compra:</th>
                <td>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(Dollar.ask)}</td>
              </tr> 
              <tr>
                <th>Variação:</th>
                <td>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(Dollar.varBid)}</td>
              </tr>
              </tbody> 
            </table>
          </div>
          <div className= "col-sm-3" id="div-cotacao-euro">
            <table  className="table-condensed">
              <tbody>              
              <tr ><th colSpan="2" style={{textAlign: "center"}}>Euro:</th></tr>          
              <tr>
                <th>Venda:</th>
                <td>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(Euro.bid)}</td>
              </tr>          
              <tr>
                <th>Compra:</th>
                <td>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(Euro.ask)}</td>
              </tr> 
              <tr>
                <th>Variação:</th>
                <td>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(Euro.varBid)}</td>
              </tr>
              </tbody> 
            </table>
          </div> 
          <div className= "col-sm-3" id="div-cotacao-bitcoin">
            <table className="table-condensed">
              <tbody>
                <tr><th colSpan="2" style={{textAlign: "center"}}>Bitcoin:</th></tr>                
              <tr>
                <th>Venda:</th>
                <td>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(BitCoin.bid)}</td>
              </tr>          
              <tr>
                <th>Compra:</th>
                <td>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(BitCoin.ask)}</td>
              </tr> 
              <tr>
                <th>Variação:</th>
                <td>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(BitCoin.varBid)}</td>
              </tr>
              </tbody>
            </table>
          </div>         
        </div>      
      </div>
    </div>    
  );
};
