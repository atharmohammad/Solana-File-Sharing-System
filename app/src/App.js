import './App.css';
import FileUploadPage  from './FileUpload';

function App() {
  return (
  <div className="App">
    <header className="App-header">
      <div>
        <p>Solana File Sharing System</p>
      </div>
      <div>
        <FileUploadPage />
      </div>
    </header>
  </div>
  );
}

export default App;
