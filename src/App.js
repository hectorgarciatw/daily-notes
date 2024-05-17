import './App.css';
import Content from './components/Content';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';

function App() {
    return (
        <div className="App">
            <Navbar />
            <header className="App-header">
                <Content />
            </header>
            <Footer />
        </div>
    );
}

export default App;
