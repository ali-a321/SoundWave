import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import soundPic1 from "../images/mobileSong.jpg"

function DownloadForm() {
    const [linkData, setLinkData] = useState([{ linkUrl: '' }]);
    const {linkUrl} = linkData
    const [csrfToken, setCSRFToken] = useState('');
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        // Fetch the CSRF token when the component mounts
        axios.get('http://127.0.0.1:8000/api/getcsrftoken')
          .then(response => {
            setCSRFToken(response.data.csrfToken);
          })
          .catch(error => {
            console.error('Error fetching CSRF token:', error);
          });
      }, []);
    const onChangeLink = (e, index) => {
        const { name, value } = e.target;
        const updatedLinks = [...linkData];
        updatedLinks[index] = { ...updatedLinks[index], [name]: value };
        setLinkData(updatedLinks);
    };    
    
    const onSubmit = async (e) => {
        e.preventDefault();
        setDownloading(true);
        console.log(linkData);
        const linksAsString = linkData.map((linkObj) => linkObj.linkUrl).join(',');
        console.log(linksAsString);
        console.log("started");
      
        // Create an object with the yt_urls property
        const ytUrlsObject = {
          yt_urls: linksAsString,
        };
      
        // Convert the object to a JSON string
        const ytUrlsJSON = JSON.stringify(ytUrlsObject);
      
        console.log(ytUrlsJSON);
        
        // Set the CSRF token in the request headers
        const config = {
          headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json',
          },
        };
      
        // Send the JSON data in the request body
        axios.post('http://127.0.0.1:8000/api/download', ytUrlsJSON, config)
          .then((response) => {
  
            console.log(response.data.message); // Output the response from the backend
            setLinkData([{ linkUrl: '' }]);
            setDownloading(false);

          })
          .catch((error) => {
            console.error('Error during download:', error);
            console.log('An error occurred during download. Please try again later.');
          });
          console.log("ended");

      };

   
    const onDeleteLink = (index) => {
        setLinkData((prevLinks) => prevLinks.filter((_, i) => i !== index));
    };
    const addAnotherLink = () => {
        setLinkData((prevLinks) => [...prevLinks, { linkUrl: '' }]);
    };

    
    return (
        <div className="downloadForm">
            <section className="form">
                <form onSubmit={onSubmit}>
                    {linkData.map((link, index) => (
                        <div key={index} className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                name="linkUrl"
                                required
                                maxLength={100}
                                value={link.linkUrl}
                                onChange={(e) => onChangeLink(e, index)}
                                placeholder="Youtube URL"
                                autoComplete="off"
                            />
                            <button
                                className={`deleteBtn ${index === 0 ? 'transparent' : ''}`}
                                onClick={() => onDeleteLink(index)}
                              >
                                Delete
                            </button>
                        </div>
                    ))}
                    <div className="addBtn" onClick={addAnotherLink}>
                        + Add 
                    </div>
                    <div className="btnContainer">
                          {downloading ? (
                          <button className="startBtn dummyBtn" disabled>
                              Downloading, Please wait...
                          </button>
                      ) : (
                        <button className="startBtn" type="submit" disabled={!linkData.some(link => link.linkUrl) || downloading}>
                              Download
                              </button>
                      )}
                  </div>
      
                </form>
           
            </section>
            
        </div>
    );
}

export default DownloadForm;