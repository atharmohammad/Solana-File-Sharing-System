import React, {ChangeEvent, useState} from "react";
import { create } from 'ipfs-http-client'
const str:any = new URL('https://ipfs.infura.io:5001/api/v0');
const client = create(str)
interface HTMLInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
}
interface IProps {
    share:any
}
const FileUploadPage : React.FC<IProps> = ({share}) => {
    const [selectedFile, setSelectedFile] = useState<any | null>(null);
    const [isFilePicked, setIsFilePicked] = useState(false);
    const [fileHash, updateFileUrl] = useState(``)


    const changeHandler = (event:React.ChangeEvent<HTMLInputElement>) => {
        const files = event?.currentTarget.files as FileList;
        setSelectedFile(files[0]);
        setIsFilePicked(true);
    };

    const handleSubmission = async() => {
        try {
            const added = await client.add(selectedFile)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            updateFileUrl(added.path)
            console.log(url)
            console.log(added.path)
            share(added.path)
        } catch (error) {
            console.log('Error uploading file: ', error)
        }  

    };

    return(
        <div className="FileUpload">
            <form method="POST" encType="multipart/form-data">
                
                <label htmlFor="file" className="uploadLabel">
                    <input type="file" id="file" name="file" 
                    onChange={changeHandler} className="uploadButton"/>    
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