import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';


class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			preVal : 0,
			crrVal : null,
			dotPressed : false,
			negative : false,
			formula : ''
		}
	}


	addDecimal(e){
		let lastDigit;
		if(this.state.formula && this.state.formula[this.state.formula.length-1].toString() !== '0'){
		 lastDigit = this.state.formula[this.state.formula.length-1].toString();
		} else if(this.state.formula[this.state.formula.length-1].toString() == '0'){
			lastDigit='1'
		}
		
		if(!this.state.dotPressed && parseFloat(lastDigit)){
			this.setState({
				formula: this.state.formula + e.target.value,
				crrVal : this.state.formula + e.target.value,
				dotPressed : true
			})
		}
	}

	addNumber(e){
		let str = this.state.crrVal;
		let eValue = e.target.value;
		let chk;
		if(str){
			chk = str.startsWith('0') && str.length === 1
		}
		if (str == '0' && eValue == '0'){

		}else if(!chk){
			this.setState({
			formula : this.state.formula + e.target.value,
			crrVal : this.state.formula + e.target.value,
			preVal : e.target.value
		})
		}
		
	}

	handleOperator(e){
		let str = this.state.formula;
		let eValue = e.target.value;
		let chk = str[str.length-1];
		if (chk !== '+' && chk!== '-' && chk !== '/' && chk !== 'x'){
			this.setState({
			formula : this.state.formula + e.target.value,
			crrVal : this.state.formula + e.target.value,
			dotPressed : false,
			preVal : e.target.value
		})
		} else if (chk !== eValue){
			str = str.slice(0,str.length-1);
			this.setState({
				formula : str + eValue,
				crrVal : str + eValue,
				dotPressed : false,
				preVal : eValue
			})

		}
		
	}
	clearValues(){
		this.setState({
			crrVal: null,
			preVal: 0,
			formula: '',
			dotPressed:false,
			negative:false
		})
	}
	negative(e){

		let str = this.state.formula.toString();
		let eValue = e.target.value;
		let chk = str[str.length-1];

		if(!this.state.negative){
			this.setState({
			formula: str.concat(e.target.value),
			crrVal : str.concat(e.target.value),
			preVal : e.target.value,
			negative : true,
			dotPressed : false
		})
		} else {

		}
		


	}
	evaluate(e){



		var regAdd = /[0.]*\d*[+]*[0.]*\d*/g;
		var regMul = /(([-]*\d*[.])*[-]*\d+[x][-]*\d+[.]*\d*([x]+[-]*\d+[.]*\d*)*)/g;
		var regSub = /[-]\d*[.]*[\d]*/g;
		var regDiv = /(([-]*\d*[.])*[-]*\d+[/]([-]*\d*[.])*[-]*\d+([/]+[-]*\d+)*)/g;

		var str = this.state.formula;

		str = str.replaceAll('x','*');
		var final = window.eval(str);
		final = Math.fround(final);
		final = Math.floor(final*100000)/100000;
		console.log(final);
		var forDiv = str.toString().match(regDiv);
		if(forDiv){
			let divi = forDiv.map((el)=>el.split('/')).map((el)=>el.reduce((a,b)=>a/b)).filter((el)=>el!=='').map((el)=>parseFloat(el));
			for (let i in forDiv){
				str = str.replace(forDiv[i],divi[i]);
			}
		}

		var forMul = str.toString().match(regMul);
		if (forMul){
			let multi = forMul.map((el)=>el.split('x')).map((el)=>el.reduce((a,b)=>a*b,1)).filter((el)=>el!=='').map((el)=>parseFloat(el));
			for (let i in forMul){
				str = str.replace(forMul[i],multi[i]);
			}
		}
		
		var forSub = str.toString().match(regSub);
		if (forSub){
			var subtract = forSub.map((el)=>el.split(/[-]/)).flat().filter((el)=>el!=='').map((el)=>parseFloat(el)).reduce((a,b)=>a+b,0);
			var str = str.replaceAll(regSub,'');
		} else {
			var subtract = 0;
		}
		
		
		var adding = str.toString().match(regAdd).map((el)=>el.split('+')).flat().filter((el)=>el!=='').map((el)=>parseFloat(el)).reduce((a,b)=>a+b,0);
		//var final = adding - subtract;

		let dotChk = final.toString().includes('.');
		if(final || final==0){
					this.setState({
			crrVal : final,
			formula : final.toString(),
			preVal : final,
			dotPressed : dotChk,
			negative : false
		})
		}

	}

	dltItem(){
		let str = this.state.formula.toString();
		let chk = str[0];
		if(str.length > 1){
			str = str.slice(0,str.length-1);
		} else if (str !== '0'){
			str = '';
		}
		
		this.setState({
			formula : str,
			crrVal : str
		})
	}


	render() {
		return (<div className="container container-fluid justify-content-center clearfix main">
			<h1 id='heading'>Calculator </h1>
			<div id="display" className="container container-fluid bg-light flex-end ">
			<h1 className="field">{this.state.crrVal}</h1>

			</div>
			
			<Bttns addN={this.addNumber.bind(this)} handO={this.handleOperator.bind(this)} summ={this.evaluate.bind(this)} handD={this.addDecimal.bind(this)}
			clr={this.clearValues.bind(this)} neg={this.negative.bind(this)} dlt={this.dltItem.bind(this)}/>
			<h6 id="footing">-By Sajid Ameen </h6>
		</div>

		)
	}
};




class Bttns extends React.Component {
	constructor(props){
		super(props)
	}

	render(){
		return (<div className="container bg-dark clearfix " id="button-pads" >
			{/*  */}
			<div id='keypad' >

			<button className="btn btn-outline-secondary" id="zero" onClick={this.props.addN} value={0}  >0</button>
			<button className="btn btn-outline-secondary" id="one" onClick={this.props.addN} value={1} >1</button>
			<button className="btn btn-outline-secondary" id="two" onClick={this.props.addN} value={2} >2</button>
			<button className="btn btn-outline-secondary" id="three" onClick={this.props.addN} value={3} >3</button>
			<button className="btn btn-outline-secondary" id="four" onClick={this.props.addN} value={4} >4</button>
			<button className="btn btn-outline-secondary" id="five" onClick={this.props.addN} value={5} >5</button>
			<button className="btn btn-outline-secondary" id="six" onClick={this.props.addN} value={6} >6</button>
			<button className="btn btn-outline-secondary" id="seven" onClick={this.props.addN} value={7} >7</button>
			<button className="btn btn-outline-secondary" id="eight" onClick={this.props.addN} value={8} >8</button>
			<button className="btn btn-outline-secondary" id="nine" onClick={this.props.addN} value={9} >9</button>
			<button className="btn btn-outline-secondary" id="add" onClick={this.props.handO} value={'+'} >+</button>
			<button className="btn btn-outline-secondary" id="subtract" onClick={this.props.handO} value={'-'} >-</button>
			<button className="btn btn-outline-secondary" id="multiply" onClick={this.props.handO} value={'x'} >x</button>
			<button className="btn btn-outline-secondary" id="divide" onClick={this.props.handO} value={'/'} >/</button>
			<button className="btn btn-outline-secondary" id="decimal" onClick={this.props.handD} value={'.'} >.</button>
			<button className="btn btn-outline-primary ctr" id="equals"  onClick={this.props.summ} value={'='} >=</button>
			<button className="btn btn-outline-warning ctr" id="negative"  onClick={this.props.neg} value={'-'} >+/-</button>
			<button className="btn btn-outline-danger ctr" id="clear" onClick={this.props.clr} value={'c'} >AC</button>
			<button onClick={this.props.dlt} className="btn btn-outline-danger ctr">C</button>



			</div>

		</div>)
		
	}
}









ReactDOM.render(<App />,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

