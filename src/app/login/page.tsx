export default function LoginPage() {
    return (
        <main style={{ padding: "2rem", textAlign: "center" }}>
            <h1>Login</h1>
            <form style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "200px", margin: "auto" }}>
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Senha" />
                <button type="submit">Entrar</button>
            </form>
        </main>
    );
}
