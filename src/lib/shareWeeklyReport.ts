import { toPng } from 'html-to-image';
import { toast } from 'sonner';

export const shareWeeklyReport = async (element: HTMLElement | null) => {
    if (!element) return;
    try {
        const dataUrl = await toPng(element, { 
            cacheBust: true, 
            backgroundColor: '#0a0a0a', 
            pixelRatio: 2 
        });
        
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const file = new File([blob], 'microtrack-weekly.png', { type: blob.type });

        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                title: 'MicroTrack Weekly Report',
                text: 'Check out my weekly nutrition report from MicroTrack!',
                files: [file]
            });
        } else {
            const link = document.createElement('a');
            link.download = 'microtrack-weekly.png';
            link.href = dataUrl;
            link.click();
            toast.success("Weekly recap downloaded successfully!");
        }
    } catch (err) {
        console.error(err);
        toast.error("Failed to generate image.");
    }
};
