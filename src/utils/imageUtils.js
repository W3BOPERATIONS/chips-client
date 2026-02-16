export const getProductImage = (product, type = 'collection') => {
    if (!product) return "/placeholder.svg";

    const imageUrl = product.imageURL;
    const productName = product.name;

    if (imageUrl?.startsWith('http')) {
        const slug = productName.toLowerCase().replace(/\s+/g, '-');
        if (type === 'details') {
            return `/public/details/${slug}.png`;
        }
        // defaulting to collection for cards, cart, checkout
        return `/public/collections/${slug}.png`;
    }

    return imageUrl || "/placeholder.svg";
};
