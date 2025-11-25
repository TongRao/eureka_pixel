export function Footer() {
    return (
        <footer className="w-full py-8 mt-20 border-t border-white/5">
            <div className="container mx-auto px-4 text-center text-sm text-white/40">
                <p>&copy; {new Date().getFullYear()} EurekaPixel. All rights reserved.</p>
            </div>
        </footer>
    )
}
