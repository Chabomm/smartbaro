import Seo from '@/components/Seo';
export default function LayoutPopup({ children, title }) {
    return (
        <>
            <Seo title={title} />
            <div className="edit_popup w-full bg-slate-100 mx-auto py-10" style={{ minHeight: '100vh' }}>
                <div className="px-9">{children}</div>
            </div>
        </>
    );
}
