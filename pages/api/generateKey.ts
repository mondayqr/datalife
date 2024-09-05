import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';  // Thay vì require, sử dụng import

const getDomainHash = (domain: string): string => {
    const domainParts = domain.split('.').reverse();
    if (domainParts[0] === 'com' || domainParts[0] === 'net' || domainParts[0] === 'org') {
        domainParts.shift();
    }
    if (domainParts[1]) {
        const domainHash = domainParts[1];
        return crypto.createHash('md5').update(crypto.createHash('md5').update(domainHash + '780918').digest('hex')).digest('hex');
    }
    return '';
};

const generateKey = (domain: string, version: string): string => {
    const domainHash = getDomainHash(domain);
    return crypto.createHash('md5').update(domainHash + version).digest('hex');
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { domain, version } = req.body;
        if (domain && version) {
            const key = generateKey(domain, version);
            res.status(200).json({ key });
        } else {
            res.status(400).json({ error: 'Thiếu thông tin tên miền hoặc phiên bản' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
