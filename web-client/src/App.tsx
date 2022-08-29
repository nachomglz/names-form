import React, { useState, useEffect, ChangeEvent } from "react"
import axios from "axios"
import { pageArray } from "./utils/functions"

import "./index.css"

interface Name {
  _id?: string;
  name: string;
  meaning: string;
  origin: string;
  isEditing?: boolean;
}



function App() {
  const [originalNamesList, setOriginalNamesList] = useState<Name[]>([])
  const [names, setNames] = useState<Name[]>([])
  const [pages, setPages] = useState<Name[][]>([]);
  const [lastShownPage, setLastShownPage] = useState<number>(0)

  useEffect(() => {
    // Get names from database
    axios.get("http://localhost:8080/names")
      .then(res => {
        if (res.data && res.data?.status === "success") {

          const allNames = res.data?.names
          const pagedNames = pageArray<Name>(allNames, 5)

          setOriginalNamesList([...allNames])
          setNames([...allNames])
          setPages(pagedNames)

        }
      })
  }, [])

  const deleteName = (id: string) => {
    // make request to delete name
    axios.delete("http://localhost:8080/delete", { data: { _id: id } }).then(res => {
      if (res.data?.status === "success" && res.data?.name?.deletedCount > 0) {
        // the name has been deleted correctly, delete the same name from the list of names
        const newNamesList = [...originalNamesList].filter(name => name._id !== id)

        let pagedNames: Name[][] = pageArray<Name>(newNamesList, 5)

        setNames(newNamesList)
        setPages(pagedNames)
      }
    })
  }

  const changeSearchBar = (e: any) => {
    const { value } = e.target

    const filteredList = originalNamesList.filter(name => name.name.toLowerCase().indexOf(value.toLowerCase()) > -1)
    const pagedNames: Name[][] = pageArray<Name>(filteredList, 5)

    setPages(pagedNames)
  }

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
          // The name has been added to the database
          setNames(names => ([...names, name]))

        } else if (res.data?.status === "failed") {
          alert("El nombre ya existe en la base de datos")
        }

      })
      .catch(err => {
        console.error(err)
      })


  }

  return (
    <div className="container mx-auto my-4">
      <h3 className="text-2xl font-bold">Formulario para crear un nombre</h3>
      <form onSubmit={handleSubmit} >
        {/* name, meaning, origin */}

        <div className="form-fieldset my-3">
          <label htmlFor="name">Nombre: </label>
          <input type={"text"} name="name" className="border rounded px-3 py-1 w-full" placeholder="Introduce el nombre... " />
        </div>

        <div className="form-fieldset my-3">
          <label htmlFor="meaning">Significado: </label>
          <input type={"text"} name="meaning" className="border rounded px-3 py-1 w-full" placeholder="Introduce el significado... " />
        </div>

        <div className="form-fieldset my-3">
          <label htmlFor="origin">Origen: </label>
          <input type={"text"} name="origin" className="border rounded px-3 py-1 w-full" placeholder="Introduce el código del país... " />
        </div>

        <div className="form-fieldset my-3">
          <input type={"submit"} value="Enviar" className="border rounded px-3 py-1 hover:bg-blue-500" />
        </div>

      </form>

      <div className="my-10 flex flex-col w-75">

        <input onChange={changeSearchBar} className="border rounded px-3 py-1 w-full mb-5" placeholder="Escribe para buscar un nombre..." />

        <table className="min-w-max divide-y divide-gray-200" >
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase border">Nombre</th>
              <th className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase border">Significado</th>
              <th className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase border">Origen</th>
              <th className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase border">Eliminar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pages[lastShownPage]?.map((value: Name, index: number) => (
              <React.Fragment key={index}>
                <tr>
                  <td className="px-6 py-3 text-s text-center text-black border">{value.name}</td>
                  <td className="px-6 py-3 text-s text-center text-black border">{value.meaning}</td>
                  <td className="px-6 py-3 text-s text-center text-black border">{value.origin}</td>
                  <td className="px-6 py-3 text-s text-center text-white border"><button className="bg-red-400 hover:bg-red-500 rounded px-3 py-1" onClick={() => deleteName(value?._id ?? "")}>Eliminar</button></td>
                </tr>
              </React.Fragment>

            ))}
          </tbody>

        </table>
        <div className="table-pagination mt-5 flex justify-between items-center">
          <div className="prev-page">
            <button onClick={() => {
              if (lastShownPage > 0) {
                setLastShownPage(lsp => lsp - 1)
              }
            }} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-3 border border-gray-400 rounded shadow">&lt;</button>
          </div>
          <div className="page-numbers">
            <p>Página: {lastShownPage + 1} de {pages.length}</p>
          </div>
          <div className="next-page">
            <button onClick={() => {
              if (lastShownPage != pages.length - 1) {
                setLastShownPage(lsp => lsp + 1)
              }
            }} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-3 border border-gray-400 rounded shadow">&gt;</button>
          </div>
        </div>
      </div>

    </div >
  );
}

export default App;
