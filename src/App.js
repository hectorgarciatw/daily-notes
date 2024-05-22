import './App.css';
import Content from './components/Content';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';

function App() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex flex-grow">
                <header className="flex-grow p-4">
                    <Content />
                </header>
            </div>
            <Footer />
        </div>
    );
}
export default App;
