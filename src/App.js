import { useEffect, useState } from 'react';
import './App.css';
import axios from "axios";
import FormTable from './components/FormTable';

axios.defaults.baseURL = "http://localhost:8080/"

function App() {
  const [addSection, setAddSection] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", mobile: "" });
  const [formDataEdit, setFormDataEdit] = useState({ _id: "", name: "", email: "", mobile: "" });
  const [dataList, setDataList] = useState([])
  const [editSection, setEditSection] = useState(false)

  const handleOnChange = (e) => {
    const { value, name } = e.target
    setFormData((previousValue) => {
      return {
        ...previousValue,
        [name]: value,
      }
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const data = await axios.post("/create", formData)
    if (data.data.message) {
      setAddSection(false)
      alert(data.data.message)
      setFormData({ name: "", email: "", mobile: "" })
    }
  }

  const getFetchData = async () => {
    const data = await axios.get("/")
    if (data.data.success) {
      setDataList(data.data.data)
    }
  }

  useEffect(() => {
    getFetchData()
  })

  const handleDelete = async (id) => {
    const data = await axios.delete("/delete/" + id)
    if (data.data.success) {
      getFetchData()
      alert(data.data.message)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    const data = await axios.put("/update", formDataEdit)
    if (data.data.success) {
      getFetchData()
      alert(data.data.message)
      setEditSection(false)
    }
  }

  const hanldeEditOnChange = async (e) => {
    const { value, name } = e.target
    setFormDataEdit((previousValue) => {
      return {
        ...previousValue,
        [name]: value,
      }
    })
  }

  const handleEdit = (data) => {
    setFormDataEdit(data)
    setEditSection(true)
  }

  return (
    <>
      <div className="container">
        <button className="btn btn-add" onClick={() => setAddSection(true)}>Add</button>

        {
          addSection && (
            <FormTable
              handleSubmit={handleSubmit}
              handleOnChange={handleOnChange}
              handleClose={() => setAddSection(false)}
              rest={formData}
            />
          )
        }
        {
          editSection && (
            <FormTable
              handleSubmit={handleUpdate}
              handleOnChange={hanldeEditOnChange}
              handleClose={() => setEditSection(false)}
              rest={formDataEdit}
            />
          )
        }

        <div className="tableContainer">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
                dataList[0] ? (
                  dataList.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td>{data.name}</td>
                        <td>{data.email}</td>
                        <td>{data.mobile}</td>
                        <td>
                          <button className='btn btn-edit'
                            onClick={() => handleEdit(data)}
                          >Edit</button>

                          <button className='btn btn-delete' onClick={() => handleDelete(data._id)}>Delete</button>
                        </td>
                      </tr>
                    )
                  })
                )
                  :
                  (
                    <p style={{ textAlign: "center" }}>No Data</p>
                  )
              }
            </tbody>
          </table>
        </div>

      </div >
    </>
  );
}

export default App;
