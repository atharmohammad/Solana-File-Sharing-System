import React, {ChangeEvent, useState} from "react";
interface HTMLInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
}
const FileUploadPage : React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<any | null>(null);
    const [isFilePicked, setIsFilePicked] = useState(false);

    const changeHandler = (event?:HTMLInputEvent) => {
        const files = event?.target.files as FileList;
        console.log(files[0]);
        setSelectedFile(files[0]);
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
                
                <label htmlFor="file" className="uploadLabel">
                    <input type="file" id="file" name="file" 
                    onChange={(event?:ChangeEvent<HTMLInputElement>)=>changeHandler} className="uploadButton"/>    
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