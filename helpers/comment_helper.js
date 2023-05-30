import { randTextRange, randFullName, randEmail } from '@ngneat/falso';

export const createRandomComment = (postId) => {
    const comment = {
    post_id: postId,
    name: randFullName({gender: 'female'}),
    email: randEmail({provider: 'jenseneductaion', suffix: 'se', gender: 'female'}),
    body: randTextRange({ min: 10, max: 50 })
    
};
    return comment;

}
    
