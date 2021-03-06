import axios from 'axios';
import React, { useContext, useState } from 'react';
import MyContext from "../MyContext";
// import axios from 'axios'

export default function NewRecipeForm( props ) {
  const {curUser, setUser, addedRecipes, setAddedRecipes} = useContext(MyContext);

  const [recipeInputs, setRecipeInputs] = useState({
      name: "",
      steps: "",
      ingredients: [""]
  }); 
  
  const handleChange = e => {
      if(e.target.name === "name" || e.target.name === "steps"){
          setRecipeInputs({...recipeInputs,
              [e.target.name]: e.target.value
          });
      } else {
          let ingredients = [...recipeInputs.ingredients];
          ingredients[e.target.name] = e.target.value;
          setRecipeInputs({...recipeInputs,
              ingredients
          });
      }
  }

  const handleSubmit = (e) =>{
    e.preventDefault();
    let recipe = {name: recipeInputs.name, steps: recipeInputs.steps};
    axios.post('http://localhost:8080/api/recipes/create', recipe )
      .then(rsp => {            
        setAddedRecipes([...addedRecipes, rsp.data]);
        setUser({...curUser, addedRecipes: [...addedRecipes, rsp.data]});

        let ingredients = [curUser.email];
        for(let i=0; i<recipeInputs.ingredients.length; i++){
          if(recipeInputs.ingredients[i]) ingredients.push(recipeInputs.ingredients[i]);
        }
        console.log(ingredients);
        axios.post(`http://localhost:8080/api/recipes/${rsp.data.id}/completerelationships`, ingredients)
          .then(rsp => console.log(rsp))
          .catch( err => console.log(err));
      }).catch( err => console.log(err));

    setRecipeInputs({
        name: "",
        steps: "",
        ingredients: [""]
    });
  };

  const destroyHopesAndDreams = (e) => {
    e.preventDefault();
    let ingredients = [...recipeInputs.ingredients];
    ingredients.push("");
    setRecipeInputs({...recipeInputs,
        ingredients
    });
  }

  const employHopesAndDreams = (e, idx) => {
    e.preventDefault();
    let ingredients = [...recipeInputs.ingredients];
    ingredients.splice(idx, 1, false);
    setRecipeInputs({...recipeInputs,
      ingredients
    });
  }
  
  return (
    <div className="row">
      <div className="col s10 offset-s1 card blue-grey darken-1">
        <form onSubmit={handleSubmit} className="card-content white-text row" >
          <p className="card-title">Add a Recipe</p>
          <div className="input-field col s12 row">
            <input
              type="text"
              name="name"
              id="name"
              // placeholder="Name"
              className="white-text"
              value={recipeInputs.name}
              onChange={handleChange}
            />
            <label htmlFor="name" className="blue-grey-text text-lighten-4">
            Name
            </label>
          </div>

          <div className="input-field col s12 row">
            <textarea
              className="materialize-textarea white-text"
              type="text"
              name="steps"
              id="steps"
              // placeholder="Steps"
              value={recipeInputs.steps}
              onChange={handleChange}
            />
            <label htmlFor="steps" className="blue-grey-text text-lighten-4">
              Steps
            </label>
          </div>

          {(recipeInputs.ingredients).map(( i, idx) =>
            <div key={idx} style={{minHeight: "0px"}}>
              {i === false? null :
                <div key={idx} className="input-field col s12 row">
                  <label htmlFor="ingredients" className="blue-grey-text text-lighten-4">
                    Ingredient
                  </label>

                  <input
                    type="text"
                    name={idx}
                    id={`ingredients${idx}`}
                    
                    value={recipeInputs.ingredients[idx]}
                    onChange={handleChange}
                    className="col s10 white-text"
                  />

                  <button className="btn waves-effect waves-dark pink accent-3 black-text right" onClick={(e) => employHopesAndDreams(e, idx)} value={idx}>
                    <i className="material-icons">remove_circle_outline</i>
                  </button>
                  
                </div>
              }
            </div>
              
          )}

          <div className="col s12">
              <button className="left btn waves-effect waves-dark lime accent-3 black-text" onClick={ (e)=>destroyHopesAndDreams(e)}>
                <i className="material-icons">add_circle_outline</i>
              </button>
          </div>

        <input type="submit" value="Add Recipe" className="btn waves-effect waves-light" />
        </form>
      </div>
    </div>
  )
}
