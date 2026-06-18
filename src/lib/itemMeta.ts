import {
  Box,
  Code2,
  Database,
  ExternalLink,
  FileText,
  Globe,
  MessageCircle,
  Play,
  Video,
  type LucideIcon,
} from 'lucide-react';

/**
 * Pick a link-chip icon. We trust the destination URL (host/path) first — it's
 * far more accurate than the human label (e.g. a "Demo" link that actually points
 * at a Hugging Face model collection). Label is only a fallback.
 */
export function iconForLink(url: string, label = ''): LucideIcon {
  let host = '';
  let path = '';
  try {
    const u = new URL(url);
    host = u.hostname.replace(/^www\./, '');
    path = u.pathname;
  } catch {
    /* not a parseable URL — fall through to label hints */
  }

  if (host.endsWith('arxiv.org') || /\.pdf(\?|#|$)/i.test(url)) return FileText;
  if (host === 'github.com') return Code2;
  if (host.endsWith('github.io')) return Globe;
  if (host.endsWith('youtube.com') || host === 'youtu.be') return Video;
  if (host.includes('colab.research')) return Play;
  if (host.endsWith('huggingface.co') || host === 'hf.co') {
    return path.startsWith('/datasets') || /dataset/i.test(label) ? Database : Box;
  }
  if (host === 'x.com' || host.endsWith('twitter.com')) return MessageCircle;

  if (/paper|pdf|report|abstract|arxiv/i.test(label)) return FileText;
  if (/dataset|data/i.test(label)) return Database;
  if (/video/i.test(label)) return Video;
  if (/code|repo|weights|model/i.test(label)) return Code2;
  if (/project|page|site|web|home|blog|demo/i.test(label)) return Globe;
  return ExternalLink;
}
