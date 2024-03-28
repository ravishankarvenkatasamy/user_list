
import { React, useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const [data, setdata] = useState([])
  const [modalShow, setmodalShow] = useState(false);
  const [FirstName, setFirstName] = useState("");
  const [Password, setPassword] = useState("");
  const [Username, setUsername] = useState("");
  const [Lastname, setLastname] = useState("");
  const [Email, setEmail] = useState("");
  const [isedit, setisedit] = useState(false)
  const [currentid, setcurrentid] = useState(0)
  const [filteredList, setFilteredList] = new useState(data);

  useEffect(() => {
    getdata()

  }, [])

  async function getdata() {
    await axios.get(`${process.env.REACT_APP_USER_API}`)
      .then((data) => {
        setdata(data.data)
        setFilteredList(data.data)
        console.log(data)
        const textFromStorage = localStorage.getItem('recent username');
        console.log(textFromStorage)
        var item_value = sessionStorage.getItem("recent user mail");
        console.log(item_value)
      })
  }
  async function postdata(postdata) {
    await axios.post(`${process.env.REACT_APP_USER_API}`, postdata)
      .then((data) => {
        console.log("post success")
        console.log(data)
        getdata()
        setFirstName("")
        setPassword("")
        setUsername("")
        setLastname("")
        setEmail("")
        setmodalShow(false)
        toast.success('Data Saved Successfully !', {
          position: toast.POSITION.TOP_RIGHT
        });

      })
  }
  async function updatedata(updatedata, id) {
    await axios.put(`${process.env.REACT_APP_USER_API}/${id}`, updatedata)
      .then((data) => {
        console.log("update success")
        console.log(data)
        getdata()
        setFirstName("")
        setPassword("")
        setUsername("")
        setLastname("")
        setEmail("")
        setmodalShow(false)
        toast.success('Data updated Successfully !', {
          position: toast.POSITION.TOP_RIGHT
        });

      })
  }
  async function deletedata(id) {
    await axios.delete(`${process.env.REACT_APP_USER_API}/${id}`)
      .then((data) => {
        console.log("delete success")
        console.log(data)
        toast.success('Data Deleted Successfully !', {
          position: toast.POSITION.TOP_RIGHT
        });
        getdata()


      })
  }
  const editUser = (item, id) => {
    setcurrentid(id)
    setisedit(true)
    setmodalShow(true)

    setFirstName(item.FirstName)
    setPassword(item.Password)
    setUsername(item.username)
    setLastname(item.Lastname)
    setEmail(item.Email)


  }
  const deleteUser = (id) => {
    deletedata(id)
  }
  const addUser = () => {

    setisedit(false)
    setFirstName("")
    setPassword("")
    setUsername("")
    setLastname("")
    setEmail("")
    setmodalShow(true)
  }
  const filterBySearch = (event) => {

    const query = event.target.value;
    var updatedList = [...data];
    updatedList = updatedList.filter((item) => (item.FirstName.toLowerCase().indexOf(query.toLowerCase()) !== -1
      || item.Lastname.toLowerCase().indexOf(query.toLowerCase()) !== -1
      || item.Email.toLowerCase().indexOf(query.toLowerCase()) !== -1
      || item.Password.toLowerCase().indexOf(query.toLowerCase()) !== -1
      || item.username.toLowerCase().indexOf(query.toLowerCase()) !== -1
    ));
    setFilteredList(updatedList);
  };
  async function onsubmit() {

    var postdatadetails = {

      "Email": Email,
      "FirstName": FirstName,
      "Lastname": Lastname,
      "Password": Password,
      "username": Username
    }
    if (Email != "" && FirstName != "" && Lastname != "" && Password != "" && Username != "") {
      localStorage.setItem('recent username', Username);
      sessionStorage.setItem("recent user mail", Email);
      if (!isedit) {
        postdata(postdatadetails)
      } else {
        updatedata(postdatadetails, currentid)
      }
    } else {
      toast.error('Please Enter All the Data !', {
        position: toast.POSITION.TOP_RIGHT
      });
    }


  }
  return (
    <div className='container mt-5'>
      <ToastContainer />
      <Row className='mb-3'>

        <Col xs={6} md={6}>
          <div className='float-left'>
            <Button variant="dark" onClick={() => { addUser() }}>Add User</Button>
          </div>

        </Col>
        <Col xs={6} md={6}>
          <Form.Control type="search" placeholder="Search Users List..." onChange={filterBySearch} />

        </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
            <th>Password</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        {filteredList.map((item, index) => (
          <tbody>
            <tr>
              <td>{index + 1}</td>
              <td>{item.FirstName}</td>
              <td>{item.Lastname}</td>
              <td>{item.username}</td>
              <td>{item.Password}</td>
              <td>{item.Email}</td>
              <td className='d-flex'><Button variant="primary mr-2" onClick={() => editUser(item, item.id)}>Edit</Button>
                <Button variant="danger" onClick={() => deleteUser(item.id)}>Delete</Button></td>
            </tr>

          </tbody>
        ))}
      </Table>

      <div>

      </div>


      <Modal show={modalShow} onHide={() => setmodalShow(false)} aria-labelledby="contained-modal-title-vcenter">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {FirstName == "" ? "Add User" : FirstName + " details"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="show-grid">
          <Container>
            <Row>
              <Col xs={12} md={12}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control type="input" placeholder="Enter First Name" value={FirstName} onChange={(e) => setFirstName(e.target.value)} />

                </Form.Group>
              </Col>

            </Row>

            <Row>
              <Col xs={12} md={12}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="input" placeholder="Enter Last Name" value={Lastname} onChange={(e) => setLastname(e.target.value)} />

                </Form.Group>
              </Col>

            </Row>
            <Row>
              <Col xs={12} md={12}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="input" placeholder="Enter Username" value={Username} onChange={(e) => setUsername(e.target.value)} />

                </Form.Group>
              </Col>

            </Row>
            <Row>
              <Col xs={12} md={12}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="input" placeholder="Enter Password" value={Password} onChange={(e) => setPassword(e.target.value)} />

                </Form.Group>
              </Col>

            </Row>
            <Row>
              <Col xs={12} md={12}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control type="email" placeholder="Enter Email Address" required value={Email} onChange={(e) => setEmail(e.target.value)} />

                </Form.Group>
              </Col>

            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => onsubmit(currentid)}>{isedit ? 'Update' : 'Submit'}</Button>
          <Button variant="secondary" onClick={() => setmodalShow(false)}>Close</Button>
        </Modal.Footer>
      </Modal>


    </div>
  )

}

