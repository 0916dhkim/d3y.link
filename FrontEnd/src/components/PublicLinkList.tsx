import React, { useEffect, useState } from "react";
import { fetchLinks } from "../api/links";
import LinkBox from "./LinkBox";

interface Link {
    slug: string;
    url: string;
    create_date: string;
}

const LinkList: React.FC = () => {
    const [links, setLinks] = useState<Link[]>([]);

    useEffect(() => {
        const loadLinks = async () => {
            const data = await fetchLinks();
            setLinks(data);
        };
        loadLinks();
    }, []);

    return (
        <div>
            <ul>
                {links.map((link) => (
                    <LinkBox
                        key={link.slug}
                        slug={link.slug}
                        url={link.url}
                        create_date={link.create_date}
                    />
                ))}
            </ul>
        </div>
    );
};

export default LinkList;
