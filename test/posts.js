///Barnali Tests
import supertest from "supertest";
import { expect } from "chai";
import dotenv from 'dotenv'
import { createRandomPost} from "../helpers/post_helper";
import { createRandomUser } from "../helpers/user_helper";

//configuration
dotenv.config();
//Test case for post route
describe('/posts route' , () => {
    const request = supertest('https://gorest.co.in/public/v2');
    const token = process.env.USER_TOKEN;

     let userId = null;
     let postId = null;

     before(async () => {
        const res = await request.post('/users').set("Authorization", `Bearer ${token}`).send(createRandomUser());
        userId = res.body.id;
    });

    it('GET / posts ', async () => {
        const res = await request.get('/posts');
        expect(res.body).to.not.be.empty; 
        
    });
    it('POST /posts ', async function() {
        this.retries(4);
        const data = createRandomPost(userId);
       
        const res = await request.post('/posts')
              .set('Authorization' , `Bearer ${token}`)
              .send(data);
        

               
        expect(res.body).to.include(data);
        expect(res.body).to.have.property('id');
        expect(res.status).to.eq(201);

        //Get back the id of the post we just created to use later
        postId =res.body.id;
       
    });

    it('GET /posts/:id | New post was created', async () => {
        const res = await request.get(`/posts/${postId}?access-token=${token}`);
        expect(res.body.id).to.eq(postId);
    });

    it('PUT /posts/:id ', async () => {
        const data = {
            title: 'This is a genuine post and not just lorem Ipsum',
            body: 'Supertest is awesome'
        };

        const res = await request.put(`/posts/${postId}`)
              .set('Authorization' , `Bearer ${token}`)
              .send(data);
         

        expect(res.body.title).to.eq(data.title);
        expect(res.body.body).to.eq(data.body);



    });
    
    it('PATCH/posts/:id | update a post' , async () => {
        //const postId = '40023';

        const updatedPost = {
            title: 'This is a Updated Title',
            body: 'This has Updated Content '
          };
        const res = await request.patch(`/posts/${postId}`)
          .set('Authorization' , `Bearer ${token}`)
          .send(updatedPost);
        
          expect(res.body.title).to.eq(updatedPost.title);
          expect(res.body.body).to.eq(updatedPost.body);
  

     
    });
    it('DELETE/posts/:id | New post was created' , async () => {
        const res = await request.delete(`/posts/${postId}`)
              .set('Authorization', `Bearer ${token}`);
        //console.log(res.body);
        expect(res.body).to.be.empty;
        expect(res.status).to.eq(204);
    });

    
});