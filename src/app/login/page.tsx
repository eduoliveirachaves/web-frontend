"use client"; // obrigatório se estiver usando hooks

import { useState } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Login:", email, senha);
    };

    return (
        <main style={{ padding: "2rem", textAlign: "center" }}>
            <h1>Login</h1>
            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    width: "200px",
                    margin: "auto",
                }}
            >
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />
                <button type="submit">Entrar</button>
            </form>
        </main>
    );
}
