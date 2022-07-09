import { saveAs } from "file-saver";
import { useEffect, useState } from "react";
import axios from "axios";
import JsZip from "jszip";

function App() {
  const [input, setInput] = useState([]);
  const [display, setDisplay] = useState(false);
  const [urlImgList, setUrlImgList] = useState([]);
  const [displayBtn, setDisplayBtn] = useState(false);
  function axiosTest() {
    const promise = axios.get("http://localhost:8080/api/v1/getUpload");

    const dataPromise = promise.then((response) => response.data);

    return dataPromise;
  }
  useEffect(() => {
    axiosTest().then((data) => setInput(data.images));
  }, []);

  function downloadBtn() {
    const data = input[0].images;

    data.map((item) =>
      setTimeout(() => {
        fetch(item)
          .then((response) => response.blob())
          .then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = url;

            let char = item.split(
              "http://localhost:8080/public/uploads/post/"
            )[1];
            a.download = `sekai-char-${char}.jpg`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
          })
          .catch(() => console.log("error"));
      }, 1000)
    );
  }

  function downloadUlBtn() {
    const data = urlImgList;
    console.log(data)
    setDisplay(!display)
    data.map((item) =>
      setTimeout(() => {
        fetch(item)
          .then((response) => response.blob())
          .then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = url;

            a.download = `e-la-${Date.now()}}.jpg`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
          })
          .catch(() => console.log("error"));
      }, 1000)
    );
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    const urlMain = event.target[0].value;
    setDisplayBtn(!displayBtn)
    try {
      console.log(urlMain);
      const response = await axios.post(`http://localhost:8080/api/v1/ela`, {
        urlMain,
      });
      if (response.status === 200) {
        setDisplay(!display);
        setUrlImgList(response.data.result2.url);
        setDisplayBtn(!displayBtn)
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="App">
      <label>Simple project to download image from E-hentai website : </label>
      <h2>
        Just enter url of link u want to download image uwu. Sorry but if only
        download 100 images. Cannot more if you don't want banned IP
      </h2>
      <h3>If also download image from sekai Project if you want uwu</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" />
        </label>
        <input type="submit" value="Submit" />
      </form>
      {displayBtn &&
      <div> <h3 > loading... </h3> </div>
      }

      {display && <button onClick={downloadUlBtn}> Download</button>}

      <button onClick={downloadBtn}> Download Sekai </button>
    </div>
  );
}

export default App;
