import WallOfPositivity from "@/components/WallOfPositivity";
import AuthGuard from "@/components/AuthGuard";

export default function PositivityPage(){
    return (
        <AuthGuard>
            <WallOfPositivity/>;
        </AuthGuard>
    )
}