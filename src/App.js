import './App.css';
import {useEffect,useState} from 'react';
import axios from 'axios';

const URL = 'http://localhost:80/shoplist/'

function App() {

  const [items, setItems] = useState([]);
  const [item, setItem] = useState("")
  const [quantity, setQuantity] = useState("")
  useEffect(() => {
    axios.get(URL + 'shoplist.php')
    .then ((response) => {
      setItems(response.data)
      console.log(response.data)

    }).catch(error => {
      alert(error.response ? error.response.data.error : error);
    })
  
  }, [])
  
  function save(e) {
    e.preventDefault();
    console.log({amount:parseInt(quantity)})
    const jsonItems = {
      'description':item,
      'amount':quantity
    };
    
    axios.post(URL + 'add.php',JSON.stringify(jsonItems),{
      headers:{
        'Content-Type' : 'application/json'
      }
    })


    .then ((response) => {
      setItems(items => [...items,response.data]);
      setItem("");
      setQuantity("");
    }).catch (error => {
      alert(error.response.data.error)
    }) 
  }

  function remove(id) {
    const json = JSON.stringify({id:id})
    axios.post(URL+'delete.php',json,{
      headers: {
        'Content-Type' : 'application/json'
      }
    })
    .then((response) => {
      const newListWithoutRemoved = items.filter((item, quantity) => item.id !== id);
      setItems(newListWithoutRemoved);
    }).catch(error=>{
      alert(error.respone ? error.respone.data.error : error);
    })
  }
  return (
    <div className='container'>
      <h3>Shopping List</h3>
      <form onSubmit={save}>
        <label>Item needed: </label>
        <input value={item} onChange={e => setItem(e.target.value)}></input>
        <label> Amount: </label>
        <input value={quantity} onChange={e => setQuantity(e.target.value)}></input>
        <button>Save</button>
      </form>   
    <ol>
      {items?.map( item =>
        <li key={item.id}>{item.description} {item.amount}&nbsp;
        <a href='#' className='delete' onClick={() => remove(item.id)}>Delete</a>
        
        </li>
        )}
    </ol> 
    </div>
  );
}

export default App;
