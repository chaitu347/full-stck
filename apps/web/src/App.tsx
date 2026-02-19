import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

interface User {
    id: number
    email: string
    name: string | null
}

function App() {
    const [users, setUsers] = useState<User[]>([])
    const [newUserEmail, setNewUserEmail] = useState('')
    const [newUserName, setNewUserName] = useState('')
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'


    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            // Using the proxy set in vite.config.ts or the specified API URL
            const response = await axios.get(`${API_URL}/users`)
            setUsers(response.data)
        } catch (error) {
            console.error('Error fetching users:', error)
        }
    }

    const createUser = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await axios.post(`${API_URL}/users`, {
                email: newUserEmail,
                name: newUserName
            })
            setNewUserEmail('')
            setNewUserName('')
            fetchUsers()
        } catch (error) {
            console.error('Error creating user:', error)
        }
    }

    return (
        <div className="container">
            <h1>Monorepo Demo</h1>

            <div className="card">
                <h2>Add User</h2>
                <form onSubmit={createUser} className="form">
                    <input
                        type="email"
                        placeholder="Email"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        required
                        className="input"
                    />
                    <input
                        type="text"
                        placeholder="Name"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        className="input"
                    />
                    <button type="submit" className="button">Add User</button>
                </form>
            </div>

            <div className="card">
                <h2>Users List</h2>
                {users.length === 0 ? (
                    <p>No users found</p>
                ) : (
                    <ul className="user-list">
                        {users.map((user) => (
                            <li key={user.id} className="user-item">
                                <strong>{user.name || 'Unnamed'}</strong> ({user.email})
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default App
