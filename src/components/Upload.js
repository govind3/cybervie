import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Button, Box } from "@mui/material";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import storage, { firebaseDB } from "./FirebaseConfig";
import { doc, setDoc, getDocs, collection } from "firebase/firestore";

function Upload() {
  const [percent, setPercent] = useState(0);
  const [file, setFile] = useState("");
  const [data, setdata] = useState({
    name: "",
    email: "",
  });

  const [usersData, setUsersData] = useState(null);

  function handleChange(event) {
    setFile(event.target.files[0]);
  }
  const handleUpload = () => {
    console.log(data);
    if (!data) {
      alert("Please choose a file first!");
    }

    const storageRef = ref(storage, `/files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        // update progress
        setPercent(percent);
      },
      (err) => console.log(err),
      async () => {
        // download url
        const fileURL = await getDownloadURL(uploadTask.snapshot.ref);
        await setDoc(doc(firebaseDB, "users", data.email), {
          ...data,
          file: fileURL,
          fileName: file.name,
        });
      }
    );
  };

  const getAllData = async () => {
    const colRef = collection(firebaseDB, "users");
    const colSnap = await getDocs(colRef);

    const users = [];
    if (colSnap.docs) {
      colSnap.forEach((doc) => {
        users.push(doc.data());
      });
      setUsersData(users);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  const downloadFile = (fileURL) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.onload = (event) => {
      const blob = xhr.response;
    };
    xhr.open("GET", fileURL);
    xhr.send();
  };
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Container maxWidth="lg" style={{ padding: "20px" }}>
          <h1>Enter your details and upload file:</h1>
          <TextField
            id="outlined-basic"
            label="Name"
            variant="outlined"
            name={data.name}
            onChange={(e) => setdata({ ...data, name: e.target.value })}
          />
          <br />
          <br />
          <TextField
            id="outlined-basic"
            label="Email"
            variant="outlined"
            onChange={(e) => setdata({ ...data, email: e.target.value })}
          />
          <br />
          <br />
          <Button variant="contained" component="label">
            Upload File
            <input type="file" hidden onChange={handleChange} />
          </Button>
          <br />
          <br />
          <Button variant="contained" component="label" onClick={handleUpload}>
            Submit
          </Button>
          <h3>{percent} "% done"</h3>
          <Button variant="contained" onClick={getAllData}>
            Get Data
          </Button>
          <Box display="flex" gap="1rem">
            {usersData &&
              usersData.map((user) => (
                <Card
                  sx={{ width: "300px" }}
                  style={{ marginTop: "20px" }}
                  variant="outlined"
                >
                  <CardContent>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-start"
                    >
                      <Typography
                        sx={{ mb: 1.5 }}
                        color="text.primary"
                        variant="body1"
                      >
                        Name : {user.name}
                      </Typography>
                      <Typography
                        sx={{ fontSize: 14 }}
                        color="text.secondary"
                        variant="body2"
                        gutterBottom
                      >
                        Email : {user.email}
                      </Typography>
                      <Box pt="1rem">
                        <Button
                          onClick={(e) => downloadFile(user.file)}
                          variant="outlined"
                        >
                          File : {user.fileName}
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default Upload;
