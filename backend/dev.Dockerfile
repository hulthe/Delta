FROM gradle:6.3.0-jdk11
#Gradle docker has gradle user as default
USER root


WORKDIR /app

#db is used to separate development and production databases

# Environment variables needed for Gamma to run in Production env, These must be changed!!.
COPY . /app

RUN mkdir -p /app
RUN chown -R gradle /app

ENV DB_HOST db

USER gradle

RUN gradle :build -x test
# This probably should not have a static path, but instead build in a custom path.
CMD sleep 5 && java -jar -Dspring.profiles.active=development build/libs/gamma-0.9.0-SNAPSHOT.jar

