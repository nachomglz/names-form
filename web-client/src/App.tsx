import axios from "axios"
import { StringLiteralLike } from "typescript";

interface Name {
  name: string;
  meaning: string;
  origin: string;
}

function App() {

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      name: { value: string };
      meaning: { value: string };
      origin: { value: string };
    };
    const name = target.name.value ?? ""
    const meaning = target.meaning.value ?? ""
    const origin = target.origin.value ?? ""

    // Make request to server
    axios.post("http://localhost:8080/create_name", { name, meaning, origin })
      .then(res => {
        if (res.data?.status === "success") {
          const name: Name = res.data.name
          alert(`El nombre ${name.name} ha sido añadido a la base de datos`)
        } else if (res.data?.status === "failed") {
          alert("El nombre ya existe en la base de datos")
        }

      })
      .catch(err => {
        console.error(err)
      })

  }

  return (
    <div className="App">
      <h3>Formulario para crear un nombre</h3>
      <form onSubmit={handleSubmit} >
        {/* name, meaning, origin */}

        <div className="form-fieldset">
          <label htmlFor="name">Nombre: </label>
          <input type={"text"} name="name" placeholder="Introduce el nombre... " />
        </div>

        <div className="form-fieldset">
          <label htmlFor="meaning">Significado: </label>
          <input type={"text"} name="meaning" placeholder="Introduce el significado... " />
        </div>

        <div className="form-fieldset">
          <label htmlFor="origin">Origen: </label>
          <input type={"text"} name="origin" placeholder="Introduce el código del país... " />
        </div>

        <div className="form-fieldset">
          <input type={"submit"} value="Enviar" />
        </div>

      </form>
    </div>
  );
}

export default App;
