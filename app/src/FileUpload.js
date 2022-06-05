import React, {useState} from "react";

const FileUploadPage = () => {
    const [selectedFile, setSelectedFile] = useState();
    const [isFilePicked, setIsFilePicked] = useState(false);

    const changeHandler = (event) => {
        console.log(event.target.files[0]);
        setSelectedFile(event.target.files[0]);
        setIsFilePicked(true);
    };

    const handleSubmission = () => {
        const formData = new FormData();
        formData.append('File', selectedFile);
        const uploadUrl = '';
        fetch(
            uploadUrl,
            {
                method: 'POST',
                body: formData,
            }
        )
            .then((response) => response.json())
            .then((result) => {
                console.log('Success:', result);
            })
            .catch((error) => {
                console.log('Error:', error);
            })

    };

    return(
        <div className="FileUpload">
            <form method="POST" encType="multipart/form-data">
                
                <label for="file" className="uploadLabel">
                    <input type="file" id="file" name="file" onChange={changeHandler} className="uploadButton"/>    
                    Choose a file

                </label>
                {isFilePicked ? (
                    <div>
                        <p>Filename: {selectedFile.name}</p>
                        <p>Filetype: {selectedFile.type}</p>
                        <p>Size in bytes: {selectedFile.size}</p>
                    </div>
                ) : (
                    <p>Select file to upload and click submit</p>
                )}
            </form>
            
            <div className="submit">
                <button onClick={handleSubmission}>Submit</button>
            </div>
        </div>
    )
};

export default FileUploadPage;