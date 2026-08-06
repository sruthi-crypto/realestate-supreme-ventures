import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-border bg-gradient-to-b from-background to-muted/30 mt-auto">
      {/* Bottom strip */}
      <div className="border-t border-border/50 bg-background/50 backdrop-blur-sm">
        <div className="container flex flex-col sm:flex-row items-center justify-between py-6 gap-4 text-xs text-muted-foreground">
          <p className="font-medium">© 2026 DreamHome Realty. All rights reserved.</p>
          <div className="flex gap-6">
            <button
              onClick={() => navigate("/privacy-policy")}
              className="hover:text-primary transition-colors hover:underline decoration-transparent hover:decoration-primary"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => navigate("/terms-conditions")}
              className="hover:text-primary transition-colors hover:underline decoration-transparent hover:decoration-primary"
            >
              Terms & Conditions
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
