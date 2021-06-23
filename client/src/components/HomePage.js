import React from 'react';
import {Jumbotron} from 'reactstrap';
import Header from './Header';


function HomePage(){

    //For Firebase
//   const [error, setError] = useState("")
//   const { currentUser, logout } = useAuth()
//   const history = useHistory()

//   async function handleLogout() {
//     setError("")

//     try {
//       await logout()
//       history.push("/login")
//     } catch {
//       setError("Failed to log out")
//     }
//   }


    return(
        <div>
            <Header/>
            <Jumbotron>
                <div className="container">
                    <div className="row row-header">
                        <div className="col-12 col-sm-6">
                            <h1 className="font-italic">The Pearl</h1>
                            <h5>Welcome to the admin portal</h5>
                        </div>
                    </div>
                </div>
            </Jumbotron>
        </div>
    );
}

export default HomePage;