import React, { useState, Fragment } from "react";
import { nanoid } from "nanoid";
import Web3 from "web3";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import contract from "../contracts/cruds.json";
import { useCookies } from "react-cookie";

const Visits = () => {
  const [cookies, setCookie] = useCookies();

  const [addFormData, setAddFormData] = useState({
    name: "",
    date: "",
    reason: "",
  });

  const [editFormData, setEditFormData] = useState({
    name: "",
    date: "",
    reason: "",
  });

  const [editContactId, setEditContactId] = useState(null);

  const handleAddFormChange = (event) => {
    const newFormData = { ...addFormData };
    newFormData[event.target.name] = event.target.value;
    setAddFormData(newFormData);
  };

  const handleEditFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...editFormData };
    newFormData[fieldName] = fieldValue;

    setEditFormData(newFormData);
  };

  const handleAddFormSubmit = (event) => {
    event.preventDefault();

    const newContact = {
      id: nanoid(),
      fullName: addFormData.fullName,
      address: addFormData.address,
      phoneNumber: addFormData.phoneNumber,
      email: addFormData.email,
    };

    const newContacts = [...contacts, newContact];
    setContacts(newContacts);
  };

  const handleEditFormSubmit = (event) => {
    event.preventDefault();

    const editedContact = {
      id: editContactId,
      fullName: editFormData.fullName,
      address: editFormData.address,
      phoneNumber: editFormData.phoneNumber,
      email: editFormData.email,
    };

    const newContacts = [...contacts];

    const index = contacts.findIndex((contact) => contact.id === editContactId);

    newContacts[index] = editedContact;

    setContacts(newContacts);
    setEditContactId(null);
  };

  const handleEditClick = (event, contact) => {
    event.preventDefault();
    setEditContactId(contact.id);

    const formValues = {
      fullName: contact.fullName,
      address: contact.address,
      phoneNumber: contact.phoneNumber,
      email: contact.email,
    };

    setEditFormData(formValues);
  };

  const handleCancelClick = () => {
    setEditContactId(null);
  };

  const handleDeleteClick = (contactId) => {
    const newContacts = [...contacts];

    const index = contacts.findIndex((contact) => contact.id === contactId);

    newContacts.splice(index, 1);

    setContacts(newContacts);
  };

  async function submit() {
    var accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    var currentaddress = accounts[0];

    const web3 = new Web3(window.ethereum);
    const mycontract = new web3.eth.Contract(
      contract["abi"],
      contract["networks"]["5777"]["address"]
    );
    // console.log(mycontract);

    mycontract.methods
      .getdata()
      .call()
      .then((res) => {
        for (let i = 0; i < res.length; i++) {
          var data = JSON.parse(res[i]);
          // console.log(data['mail']);
          if (data["mail"] === cookies["mail"]) {
            data["visit"].push(addFormData);

            mycontract.methods
              .updateData(parseInt(cookies["index"]), JSON.stringify(data))
              .send({ from: currentaddress })
              .then(() => {
                alert("Checkup History Saved");
                var data = cookies["visit"];
                data.push(addFormData);
                setCookie("visit", data);
              })
              .catch((err) => {
                console.log(err);
              });

            break;
          }
        }
      });
  }

  async function show() {
    cookies["visit"].map((data) => {
      console.log(data);
    });
  }

  return (
    <div className="flex relative dark:bg-main-dark-bg">
      <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
        <Sidebar />
      </div>

      <div
        className={
          "dark:bg-main-dark-bg  bg-main-bg min-h-screen ml-72 w-full  "
        }
      >
        <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
          <Navbar />
        </div>
        <div
          style={{ display: "flex", flexDirection: "column", padding: "4rem", justifyContent: "center", alignItems:"flex-end", gap:"4rem" }}
        >
          <form style={{width:"100%"}}>
            <table style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th className="">Name Of Professional</th>
                  <th className="">Date Of Visit</th>
                  <th className="">Reason?</th>
                </tr>
              </thead>
              <tbody>
                {cookies["visit"].map((mh) => (
                  <tr>
                    <td>{mh.name}</td>
                    <td>{mh.date}</td>
                    <td>{mh.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </form>

          <form style={{display:'flex', flexDirection:'column', gap:'1rem',
    backgroundColor: 'rgb(3, 201, 215)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '24px',
    borderRadius: '20px',}}>
            <h2>Add your Medical History</h2>
            <input
              type="text"
              name="name"
              required="required"
              placeholder="Name Of Professional"
              onChange={handleAddFormChange}
            />
            <input
              type="text"
              name="date"
              required="required"
              placeholder="Date of Visit"
              onChange={handleAddFormChange}
            />
            <input
              type="text"
              name="reason"
              required="required"
              placeholder="Reason"
              onChange={handleAddFormChange}
            />
            <input type="button" value="Save" onClick={submit} />
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Visits;
