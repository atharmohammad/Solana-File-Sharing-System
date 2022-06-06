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
    const [title,setTitle]  = useState("");
    const [value,setValue] = useState("");

    const changeHandler = (event:React.ChangeEvent<HTMLInputElement>) => {
        const files = event?.currentTarget.files as FileList;
        setSelectedFile(files[0]);
        setIsFilePicked(true);
    };

    const changeTitle = (event : React.ChangeEvent<HTMLInputElement>) =>setTitle(event.currentTarget.value)
    const changeDescription = (event : any) =>setValue(event.currentTarget.value)

    const handleSubmission = async() => {
        try {
            const added = await client.add(selectedFile)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            updateFileUrl(added.path)
            console.log({title,description:value,hash:added.path})
            console.log(added.path)
            
            share({title,description:value,hash:added.path})
        } catch (error) {
            console.log('Error uploading file: ', error)
        }  

    };

    return(
        <div className="FileUpload">
            <form method="POST" encType="multipart/form-data">
                
                <label htmlFor="file" className="uploadLabel">
                    <input type="file" id="file" name="file"  
                    onChange={changeHandler} className="choose-file"/>    
                </label>
                {isFilePicked ? (
                    <div className="remarks">
                        <p>Filename: {selectedFile.name}</p>
                        <p>Filetype: {selectedFile.type}</p>
                        <p>Size in bytes: {selectedFile.size}</p>
                    </div>
                ) : (
                    <p className="remarks">Select file to upload and click submit</p>
                )}
            </form>

            <input type="text" className="title-input" 
            placeholder="Title"
            onChange={changeTitle} />
            <div>
                <textarea
                    className="text-area"
                    rows={10}
                    cols={50}
                    placeholder="description"
                    onChange={changeDescription}
                    style={{ padding: "5px" }}
                />
            </div>
            <button className="submit" onClick={handleSubmission}>Submit</button>
        </div>
    )
};

export default FileUploadPage;