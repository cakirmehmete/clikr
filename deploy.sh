cd clikr-client/
yarn build
cd ../

rm -r clikr-server/app/react_app/build
cp -r clikr-client/build clikr-server/app/react_app

git add -A && git commit -m "Update Build and Deploy"
git subtree split --branch heroku --prefix clikr-server/
git push origin heroku