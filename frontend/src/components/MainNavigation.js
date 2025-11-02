import { Link } from 'react-router-dom';
import classes from './MainNavigation.module.css';

function MainNavigation() {
    return (
        <header className={classes.header}>
            <nav className="bg-blue-600 p-4 text-white">
                <ul className={classes.list}>
                    <li>
                        <Link to="/" className="hover:underline">Home</Link>
                    </li>
                    <li>
                        <Link to="/profile" className="hover:underline">Profile</Link>
                    </li>
                    <li>
                        <Link to="/employer" className="hover:underline">Employer</Link>
                    </li>
                    <li>
                        <Link to="/employees" className="hover:underline">Employees</Link>
                    </li>
                    <li>
                        <Link to="/schedule" className="hover:underline">Schedule</Link>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default MainNavigation;